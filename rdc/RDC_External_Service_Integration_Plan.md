# RDC — External Service Integration Plan

> RDC Credit Laddering sisteminin bütünlüklə xarici xidmətlərlə inteqrasiya planı.  
> Hər xidmət üçün: təsvir, data contract, error handling, timeout, mock davranışı.

---

## 1. Arxitektura Prinsipi

Bütün xarici xidmətlər **LW Provider** interfeysi arxasında gizlədilir. RDC Backend heç bir xarici servislə birbaşa əlaqə saxlamır — hər şey `pkg/lw/provider.go` interfeysi vasitəsilə olur.

```
RDC Backend
    │
    ├── pkg/sms/provider.go    ───> Softline SMS Gateway (birbaşa)
    ├── pkg/otp/provider.go    ───> SMS Provider-ə bağlıdır
    └── pkg/lw/provider.go     ───> 7+ xarici xidmət
                                      ├── SIMA KYC
                                      ├── ASAN Finance / MyGov
                                      ├── AKB (Credit Bureau)
                                      ├── Blacklist
                                      ├── Customer Loans
                                      ├── Personal Info (ASAN)
                                      └── LW Approve
```

---

## 2. SMS Gateway — Softline

### 2.1 Ümumi Məlumat

| Parametr | Dəyər |
|----------|-------|
| Provider | Softline |
| Endpoint | `GET http://gw.softline.az/sendsms` |
| Protocol | HTTP GET (query string) |
| Auth | user + password (query param) |
| Content-Type | URL-encoded |

### 2.2 Request Parametrləri

| Parametr | Tip | Məcburi | Nümunə |
|----------|-----|---------|--------|
| user | string | Bəli | `softlinetestapi` |
| password | string | Bəli | `ZXe5Gk1G` |
| gsm | string | Bəli | `994501234567` (ölkə kodu, + olmadan) |
| from | string | Bəli | `SOFTLINE` |
| text | string | Bəli | `RDC: Sizin təsdiq kodunuz 123456` |

### 2.3 Response Format

```
errno=100&errtext=OK&message_id=526973&charge=1&balance=123
```

| Sahə | Tip | İzah |
|------|-----|------|
| errno | int | Error kodu (100 = OK) |
| errtext | string | Error description |
| message_id | string | Unikal mesaj ID |
| charge | int | SMS xərci (ədəd) |
| balance | float | Qalan balans |

### 2.4 Error Codes

| errno | Mənası | RDC Davranışı |
|-------|--------|---------------|
| 100 | Uğurlu | Davam et |
| 0 | Parametr çatışmır | 500 Internal Error |
| 20 | Yalnış MSISDN formatı | 400 Bad Request |
| 25 | Nömrə blacklist-də | 400 "Phone number is blacklisted" |
| 40 | Yanlış credentials | 500 Internal Error (admin alert) |
| 60 | Balans kifayət deyil | 503 "Service temporarily unavailable" |
| 200 | Server xətası | 503 Retry after delay |

### 2.5 RDC-də İstifadə

```
OTP generasiya olunur → SMS Provider.Send(phone, "RDC: Sizin təsdiq kodunuz {code}")
→ Softline API-ya GET request → errno=100 → OTP saxlanılır
```

### 2.6 Mock Davranışı

Mock SMS Provider həmişə uğurlu qaytarır:
```json
{
  "success": true,
  "message_id": "mock_1720586400000",
  "charge": 0,
  "balance": 999.99,
  "errno": 100,
  "errtext": "OK"
}
```

---

## 3. SIMA KYC

### 3.1 Ümumi Məlumat

| Parametr | Dəyər |
|----------|-------|
| Xidmət | SIMA — Rəqəsi İdentifikasiya |
| Məqsəd | Müştərini PIN + SERİAL ilə təsdiqləmək |
| Method | `InitSimaKyc(ctx, req)` |
| Step | 3.1 |

### 3.2 Request

```json
{
  "pin": "ABCDE12345",
  "serial": "AZ",
  "phone": "+994501234567"
}
```

### 3.3 Response

```json
{
  "request_id": "SIMA-2024-001",
  "status": "pending",
  "message": "SIMA KYC initiated"
}
```

Status dəyərləri: `pending` → `verified` / `failed`

### 3.4 RDC Davranışı

1. `InitSimaKyc` çağırılır, `request_id` alınır
2. Application status: `sima_kyc_pending`
3. Poll: `CheckSimaStatus` ilə nəticə yoxlanılır
4. Uğurlu olarsa: `sima_verified`
5. Uğursuz olarsa: `rejected`

### 3.5 Mock Davranışı

Həmişə `verified` qaytarır. `request_id = "SIMA_MOCK_001"`.

---

## 4. ASAN Finance / MyGov (Gəlir Məlumatları)

### 4.1 Ümumi Məlumat

| Parametr | Dəyər |
|----------|-------|
| Xidmət | ASAN Finance (MyGov vasitəsilə) |
| Məqsəd | Müştərinin bütün bank hesablarındakı gəliri toplu şəkildə almaq |
| Method | `GetAsanFinance(ctx, pin)` |
| Step | 3.2 |

### 4.2 Request

```
PIN: "ABCDE12345"
```

### 4.3 Response

```json
{
  "accounts": [
    {
      "bank_name": "Bank A",
      "account_no": "****1234",
      "balance": 3500.00,
      "income": 1500.00
    },
    {
      "bank_name": "Bank B",
      "account_no": "****5678",
      "balance": 1200.00,
      "income": 800.00
    }
  ],
  "total_income": 2300.00
}
```

### 4.4 RDC Davranışı

1. `GetAsanFinance` çağırılır
2. `total_income` — aylıq ümumi gəlir kimi qəbul edilir
3. `debt_ratio` = `requested_amount / (total_income * 12)` hesablanır
4. Məlumatlar `loan_applications` cədvəlinə yazılır
5. Status: `mygov_verified`

### 4.5 Mock Davranışı

```json
{
  "accounts": [
    {"bank_name": "Mock Bank", "account_no": "****0001", "balance": 3000, "income": 1500}
  ],
  "total_income": 1500.00
}
```

---

## 5. AKB (Kredit Bürosu)

### 5.1 AKB Score

| Parametr | Dəyər |
|----------|-------|
| Method | `GetAkbScore(ctx, pin)` |
| Step | 4.1 |
| Məqsəd | Müştərinin kredit skorunu almaq |

**Request**: `PIN: "ABCDE12345"`

**Response**:
```json
{
  "score": 650,
  "risk_level": "medium"
}
```

Risk levels: `low` (700+), `medium` (500-699), `high` (<500)

### 5.2 AKB History

| Parametr | Dəyər |
|----------|-------|
| Method | `GetAkbHistory(ctx, pin)` |
| Step | 4.1 (DEEP check type üçün) |

**Response**:
```json
{
  "total_loans": 5,
  "active_loans": 2,
  "overdue_count": 0,
  "max_debt": 8000.00
}
```

### 5.3 Scoring-də Rolu

| Check Type | AKB Score Bal | AKB History Bal |
|------------|---------------|-----------------|
| SIMPLE | — | — |
| STANDARD | 0–50 | — |
| DEEP | 0–40 | 0–30 |

### 5.4 Mock Davranışı

- Score: 650, risk_level: "medium"
- History: 2 total, 1 active, 0 overdue, max_debt: 5000

---

## 6. Blacklist Yoxlaması

| Parametr | Dəyər |
|----------|-------|
| Method | `CheckBlacklist(ctx, pin)` |
| Step | 4.2 (scoring-dan əvvəl) |
| Məqsəd | Müştəri qara siyahıda yoxdur |

**Request**: `PIN: "ABCDE12345"`

**Response (normal)**:
```json
{
  "is_blacklisted": false
}
```

**Response (blacklisted)**:
```json
{
  "is_blacklisted": true,
  "reason": "fraud_suspect"
}
```

### RDC Davranışı

- **Blacklist = true** → Scoring baş vermir, dərhal `rejected`
- **Blacklist = false** → Scoring davam edir

---

## 7. LW Approve (Kredit Təsdiqi)

| Parametr | Dəyər |
|----------|-------|
| Method | `ApproveLoan(ctx, req)` |
| Step | 4.3 |
| Məqsəd | Credit Engine nəticəsinə əsasən krediti təsdiqləmək |

**Request**:
```json
{
  "application_id": 1,
  "amount": 5000.00,
  "product_code": "RDC_CONSUMER",
  "score": 72,
  "check_type": "STANDARD"
}
```

**Response (approved)**:
```json
{
  "success": true,
  "loan_id": "LOAN-2024-00001",
  "message": "Loan approved"
}
```

**Response (rejected)**:
```json
{
  "success": false,
  "loan_id": "",
  "message": "score_below_threshold"
}
```

### RDC Davranışı

- `success = true` → status = `approved`, loan_id saxlanılır
- `success = false` → status = `rejected`, reason saxlanılır

---

## 8. Personal Info (ASAN)

| Parametr | Dəyər |
|----------|-------|
| Method | `GetPersonalInfo(ctx, pin, serial)` |
| Step | 3.1 (SIMA əvvəli) |
| Məqsəd | Müştərinin ASAN-dan şəxsi məlumatlarını almaq |

**Request**: `PIN: "ABCDE12345", SERIAL: "AZ"`

**Response**:
```json
{
  "full_name": "Camalov Zamir",
  "pin": "ABCDE12345",
  "birth_date": "1990-01-15",
  "address": "Bakı şəhəri, Nəsimi r."
}
```

---

## 9. Customer Loans (Mövcud Kreditlər)

| Parametr | Dəyər |
|----------|-------|
| Method | `GetCustomerLoans(ctx, pin)` |
| Step | 4.2 (scoring üçün) |
| Məqsəd | Müştərinin hazırkı aktiv kreditlərini görmək |

**Response**:
```json
{
  "loans": [
    {"loan_id": "L001", "amount": 5000, "balance": 2500, "status": "active", "bank_name": "Bank A"},
    {"loan_id": "L002", "amount": 3000, "balance": 0, "status": "closed", "bank_name": "Bank B"}
  ]
}
```

---

## 10. Setup Customer Loans

| Parametr | Dəyər |
|----------|-------|
| Method | `SetupCustomerLoans(ctx, req)` |
| Step | 4.3 (approve sonra) |
| Məqsəd | Təsdiqlənmiş krediti LW-də qurmaq |

**Request**:
```json
{
  "pin": "ABCDE12345",
  "amount": 5000.00
}
```

**Response**:
```json
{
  "success": true,
  "setup_id": "SETUP-2024-001",
  "monthly_payment": 450.00
}
```

---

## 11. Xidmətlər Zaman Çizelgəsi

```
Step 1 (OTP)          Step 2 (Amount)     Step 3.1 (SIMA)    Step 3.2 (MyGov)   Step 4.1 (AKB)    Step 4.2-4.3 (LW)
    │                      │                    │                   │                  │                   │
    │ SMS: 1 req           │                    │                   │                  │                   │
    │ OTP: 1 write+read    │ DB: 1 read+update  │ LW: 2 req        │ LW: 1 req        │ LW: 2 req         │ LW: 2 req
    │ DB: 2 write+2 read   │ CE: 1 read         │ DB: 2 update     │ DB: 1 update     │ DB: 1 update      │ DB: 2 update
    │                      │                    │                   │                  │                   │
    ├─ SMS ────────────────┤                    │                   │                  │                   │
    │                      │                    ├─ SIMA ───────────┤                  │                   │
    │                      │                    │                   ├─ MyGov/ASAN ─────┤                   │
    │                      │                    │                   │                  ├─ AKB ─────────────┤
    │                      │                    │                   │                  │                   ├─ Blacklist ───────┤
    │                      │                    │                   │                  │                   ├─ CreditEngine ───┤
    │                      │                    │                   │                  │                   ├─ LW Approve ─────┤
```

**Bir tam müraciət üçün xarici call-lər**: 8-10 request  
**Bir tam müraciət üçün DB əməliyyatları**: 12-15

---

## 12. Security

| Təhlükəsizlik tədbiri | Tətbiq |
|----------------------|--------|
| PIN məlumatı | DB-də şifrlənməlidir (hazırkı fazada plain text) |
| OTP | 120 saniyə müddət, 3 cəhd limit |
| LW API | HTTPS + token-based auth (real implementasiyada) |
| SQL Injection | `database/sql` parametrized queries ilə qorunur |
| SMS flooding | `HasPendingApplication` check — eyni nömrəyə təkrar OTP yox |
| Rate limiting | Gələcək fazada əlavə olunacaq |

---

## 13. Environment-based Configuration

| Config Key | Mock | Real |
|------------|------|------|
| `SMS_PROVIDER` | `mock` | `softline` |
| `LW_PROVIDER` | `mock` | `real` |
| `SOFTLINE_USER` | — | `softlinetestapi` |
| `SOFTLINE_PASS` | — | `ZXe5Gk1G` |
| `SOFTLINE_URL` | — | `http://gw.softline.az/sendsms` |