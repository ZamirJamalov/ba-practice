# RDC Credit Laddering — Sequence Diagram

> Bu sənəd RDC (Credit Laddering) sistemində kredit müraciətinin 6 addımlı tam axınını təsvir edir.  
> Implementation Plan bu diaqrama əsaslanır.

---

## Aktyorlar

| Aktyor | Rol |
|--------|-----|
| **Müştəri (Client)** | Mobil app / vasitəsilə müraciət edir |
| **RDC Backend** | Go API server (Handler → Service → Repository) |
| **SMS Gateway** | Softline — OTP mesajları göndərir |
| **LW Provider** | Mərkəzi xidmət — 7+ xarici servisi birləşdirir |
| **SIMA** | KYC identifikasiya xidməti |
| **MyGov / ASAN Finance** | Gəlir məlumatları xidməti |
| **AKB** | Kredit Bürosu — score və tarix |
| **SQL Server** | Məlumat bazası |

---

## Status Flow (Tam)

```
┌─────────────────┐
│  otp_pending    │ ← Müştəri müraciət edir, OTP göndərilir
└────────┬────────┘
         │ OTP təsdiqləndi
         ▼
┌─────────────────┐
│  otp_verified   │ ← Müraciət bazada yaradılır
└────────┬────────┘
         │ Məbləğ seçildi
         ▼
┌─────────────────┐
│ step2_completed │ ← Check type müəyyən olundu
└────────┬────────┘
         │ SIMA KYC başladı
         ▼
┌─────────────────┐
│sima_kyc_pending │
└────────┬────────┘
         │ SIMA təsdiq olundu
         ▼
┌─────────────────┐
│  sima_verified  │
└────────┬────────┘
         │ MyGov başladı
         ▼
┌─────────────────┐
│ mygov_pending   │
└────────┬────────┘
         │ MyGov təsdiq olundu
         ▼
┌─────────────────┐
│ mygov_verified  │
└────────┬────────┘
         │ Gəlir təsdiqi + AKB score alındı
         ▼
┌─────────────────┐
│ income_verified │
└────────┬────────┘
         │ LW approve request göndərildi
         ▼
┌──────────────────┐
│lw_approve_pending│
└────────┬─────────┘
         │ LW qərarı
         ▼
   ┌─────┴─────┐
   │           │
   ▼           ▼
┌────────┐ ┌──────────┐
│approved│ │ rejected │
└────────┘ └──────────┘
```

---

## Step 1: OTP Göndərmə və Təsdiqləmə

```
Müştəri                    RDC Backend                SMS Gateway            SQL Server
   │                            │                          │                      │
   │  POST /request-otp         │                          │                      │
   │  {phone, full_name,        │                          │                      │
   │   pin, serial, birth_date} │                          │                      │
   │───────────────────────────>│                          │                      │
   │                            │                          │                      │
   │                            │  1. Müştərini tap/yarat  │                      │
   │                            │──────────────────────────────────────────────>│
   │                            │                          │                      │
   │                            │  2. Aktiv müraciət var?  │                      │
   │                            │──────────────────────────────────────────────>│
   │                            │  (HasPendingApplication) │                      │
   │                            │                          │                      │
   │                            │  3. OTP generasiya et    │                      │
   │                            │  (6 rəqəmli, 120 saniyə) │                      │
   │                            │──────────────────────────────────────────────>│
   │                            │                          │                      │
   │                            │  4. SMS göndər           │                      │
   │                            │─────────────────────────>│                      │
   │                            │                          │  GET /sendsms        │
   │                            │                          │  errno=100, OK       │
   │                            │<─────────────────────────│                      │
   │                            │                          │                      │
   │  {message, expires_at}     │                          │                      │
   │<───────────────────────────│                          │                      │
   │                            │                          │                      │
   │  POST /verify-otp          │                          │                      │
   │  {phone, code}             │                          │                      │
   │───────────────────────────>│                          │                      │
   │                            │                          │                      │
   │                            │  5. OTP verify (max 3)   │                      │
   │                            │──────────────────────────────────────────────>│
   │                            │                          │                      │
   │                            │  6. Müraciət yarad       │                      │
   │                            │  status = otp_verified   │                      │
   │                            │──────────────────────────────────────────────>│
   │                            │                          │                      │
   │  {application_id, status}  │                          │                      │
   │<───────────────────────────│                          │                      │
```

**Qaydalar**:
- Hər bir OTP 120 saniyə etibarlıdır
- Maksimum 3 cəhd — aşarsa OTP deaktiv olur
- Yeni OTP göndərildikdə əvvəlki aktiv OTP deaktiv edilir
- Aktiv müraciəti olan müştəri yeni müraciət edə bilməz

---

## Step 2: Kredit Məbləği Seçimi

```
Müştəri                    RDC Backend              Credit Engine           SQL Server
   │                            │                          │                      │
   │  POST /step2/select-amount │                          │                      │
   │  ?application_id=X         │                          │                      │
   │  {amount, product_code}    │                          │                      │
   │───────────────────────────>│                          │                      │
   │                            │                          │                      │
   │                            │  1. Status check         │                      │
   │                            │  (otp_verified olmalıdır)│                      │
   │                            │──────────────────────────────────────────────>│
   │                            │                          │                      │
   │                            │  2. Check type müəyyən et│                      │
   │                            │─────────────────────────>│                      │
   │                            │                          │  SELECT FROM          │
   │                            │                          │  check_type_config    │
   │                            │                          │  WHERE amount range   │
   │                            │                          │                      │
   │                            │  check_type = SIMPLE     │                      │
   │                            │  (və ya STANDARD/DEEP)   │                      │
   │                            │<─────────────────────────│                      │
   │                            │                          │                      │
   │                            │  3. Müraciəti yenilə      │                      │
   │                            │  status = step2_completed│                      │
   │                            │──────────────────────────────────────────────>│
   │                            │                          │                      │
   │  {amount, check_type,      │                          │                      │
   │   status}                  │                          │                      │
   │<───────────────────────────│                          │                      │
```

**Check Type Matrix**:

| Check Type | Priority | Məbləq Aralığı | Yoxlama Dərəcəsi |
|------------|----------|-----------------|-------------------|
| SIMPLE | 1 | 0 — 2,000 AZN | Sadə gəlir yoxlaması |
| STANDARD | 2 | 2,000.01 — 10,000 AZN | AKB Score + gəlir |
| DEEP | 3 | 10,000.01+ AZN | AKB + Credit History + ASAN Finance + gəlir |

---

## Step 3.1: SIMA KYC

```
Müştəri                    RDC Backend                LW Provider            SIMA
   │                            │                          │                     │
   │  POST /step3/sima-init     │                          │                     │
   │  ?application_id=X         │                          │                     │
   │───────────────────────────>│                          │                     │
   │                            │                          │                     │
   │                            │  1. Müştəri məlumatları  │                     │
   │                            │──────────────────────────────────────────────>│
   │                            │  2. Status check         │                     │
   │                            │  (step2_completed)       │                     │
   │                            │                          │                     │
   │                            │  3. InitSimaKyc          │                     │
   │                            │  {pin, serial, phone}    │                     │
   │                            │─────────────────────────>│                     │
   │                            │                          │  KYC request        │
   │                            │                          │────────────────────>│
   │                            │                          │  request_id, pending│
   │                            │                          │<────────────────────│
   │                            │  request_id, status      │                     │
   │                            │<─────────────────────────│                     │
   │                            │                          │                     │
   │                            │  4. status =             │                     │
   │                            │     sima_kyc_pending     │                     │
   │                            │──────────────────────────────────────────────>│
   │                            │                          │                     │
   │  {sima_request_id, status} │                          │                     │
   │<───────────────────────────│                          │                     │
   │                            │                          │                     │
   │  GET /step3/sima-status    │                          │                     │
   │  ?application_id=X         │                          │                     │
   │───────────────────────────>│                          │                     │
   │                            │                          │                     │
   │                            │  5. SIMA nəticə yoxla    │                     │
   │                            │  status = sima_verified  │                     │
   │                            │──────────────────────────────────────────────>│
   │                            │                          │                     │
   │  {sima_status, status}     │                          │                     │
   │<───────────────────────────│                          │                     │
```

**SIMA KYC nə edir?**
- Müştərini PIN + SERIAL ilə identifikasiya edir
- Real şəxsiyyətini təsdiqləyir
- Nəticə: `verified` və ya `failed`

---

## Step 3.2: MyGov Gəlir Yoxlaması

```
Müştəri                    RDC Backend                LW Provider         ASAN Finance / MyGov
   │                            │                          │                        │
   │  POST /step3/mygov-init    │                          │                        │
   │  ?application_id=X         │                          │                        │
   │───────────────────────────>│                          │                        │
   │                            │                          │                        │
   │                            │  1. Status check         │                        │
   │                            │  (sima_verified)         │                        │
   │                            │                          │                        │
   │                            │  2. GetAsanFinance       │                        │
   │                            │  {pin}                   │                        │
   │                            │─────────────────────────>│                        │
   │                            │                          │  Hesab məlumatları    │
   │                            │                          │  Gəlir məlumatları    │
   │                            │                          │───────────────────────>│
   │                            │                          │  accounts, income     │
   │                            │                          │<───────────────────────│
   │                            │  {accounts, total_income}│                        │
   │                            │<─────────────────────────│                        │
   │                            │                          │                        │
   │                            │  3. status = mygov_pending│                       │
   │                            │──────────────────────────────────────────────>   │
   │                            │                          │                        │
   │  {mygov_request_id, status}│                          │                        │
   │<───────────────────────────│                          │                        │
   │                            │                          │                        │
   │  GET /step3/mygov-status   │                          │                        │
   │  ?application_id=X         │                          │                        │
   │───────────────────────────>│                          │                        │
   │                            │                          │                        │
   │                            │  4. Gəlir məlumatlarını  │                        │
   │                            │     müraciətə yaz         │                        │
   │                            │  monthly_income          │                        │
   │                            │  debt_ratio              │                        │
   │                            │  status = mygov_verified │                        │
   │                            │──────────────────────────────────────────────>   │
   │                            │                          │                        │
   │  {monthly_income,          │                          │                        │
   │   debt_ratio, status}      │                          │                        │
   │<───────────────────────────│                          │                        │
```

**MyGov nə edir?**
- ASAN Finance vasitəsilə bütün bank hesablarındakı gəliri alır
- Aylıq ümumi gəliri hesablayır
- Debt ratio = kredit məbləği / (ailik gəlir × 12)

---

## Step 4.1: Gəlir Təsdiqi və AKB Score

```
Müştəri                    RDC Backend                LW Provider              AKB
   │                            │                          │                        │
   │  POST /step4/verify-income │                          │                        │
   │  ?application_id=X         │                          │                        │
   │───────────────────────────>│                          │                        │
   │                            │                          │                        │
   │                            │  1. Status check         │                        │
   │                            │  (mygov_verified)        │                        │
   │                            │                          │                        │
   │                            │  2. GetAkbScore          │                        │
   │                            │  {pin}                   │                        │
   │                            │─────────────────────────>│                        │
   │                            │                          │  Credit score sorğusu  │
   │                            │                          │───────────────────────>│
   │                            │                          │  score, risk_level     │
   │                            │                          │<───────────────────────│
   │                            │  {score, risk_level}     │                        │
   │                            │<─────────────────────────│                        │
   │                            │                          │                        │
   │                            │  3. GetAkbHistory        │                        │
   │                            │  {pin}                   │                        │
   │                            │─────────────────────────>│                        │
   │                            │  {total_loans,           │                        │
   │                            │   active_loans,          │                        │
   │                            │   overdue_count,         │                        │
   │                            │   max_debt}              │                        │
   │                            │<─────────────────────────│                        │
   │                            │                          │                        │
   │                            │  4. status =             │                        │
   │                            │     income_verified      │                        │
   │                            │──────────────────────────────────────────────>   │
   │                            │                          │                        │
   │  {akb_score, risk_level,   │                          │                        │
   │   status}                  │                          │                        │
   │<───────────────────────────│                          │                        │
```

---

## Step 4.2–4.3: LW Təsdiqi

```
Müştəri                    RDC Backend              Credit Engine           LW Provider
   │                            │                          │                      │
   │  POST /step4/lw-approve    │                          │                      │
   │  ?application_id=X         │                          │                      │
   │───────────────────────────>│                          │                      │
   │                            │                          │                      │
   │                            │  1. CheckBlacklist       │                      │
   │                            │─────────────────────────────────────────────>    │
   │                            │  {is_blacklisted}        │                      │
   │                            │<─────────────────────────────────────────────    │
   │                            │                          │                      │
   │                            │  2. Scoring              │                      │
   │                            │  (check_type-ə əsasən)   │                      │
   │                            │─────────────────────────>│                      │
   │                            │  {score, approved,       │                      │
   │                            │   max_amount, reason}    │                      │
   │                            │<─────────────────────────│                      │
   │                            │                          │                      │
   │                            │  3. status =             │                      │
   │                            │     lw_approve_pending   │                      │
   │                            │─────────────────────────────────────────────>    │
   │                            │                          │                      │
   │  {credit_score, check_type}│                          │                      │
   │<───────────────────────────│                          │                      │
   │                            │                          │                      │
   │  GET /step4/lw-decision    │                          │                      │
   │  ?application_id=X         │                          │                      │
   │───────────────────────────>│                          │                      │
   │                            │                          │                      │
   │                            │  4. ApproveLoan          │                      │
   │                            │  {amount, product_code,  │                      │
   │                            │   score, check_type}     │                      │
   │                            │─────────────────────────────────────────────>    │
   │                            │  {success, loan_id}      │                      │
   │                            │<─────────────────────────────────────────────    │
   │                            │                          │                      │
   │                            │  5. status = approved    │                      │
   │                            │     və ya rejected       │                      │
   │                            │─────────────────────────────────────────────>    │
   │                            │                          │                      │
   │  {loan_id, status,         │                          │                      │
   │   approved}                │                          │                      │
   │<───────────────────────────│                          │                      │
```

**LW Approve qərar meyarları**:

| Score | Qərar | Izah |
|-------|-------|------|
| ≥ 85 | Approved (max 10,000 AZN) | Yüksək etibarlılıq |
| 70–84 | Approved (max 5,000 AZN) | Orta-etibarlı |
| 50–69 | Əlavə sənəd tələbi | Manual yoxlama |
| < 50 | Rejected | Etibarsız |

**Blacklist** — əgər müştəri blacklist-dədirsə, scoring baş vermir, dərhal rejected.

---

## Credit Engine Scoring Model

### SIMPLE (Priority 1, 0–2000 AZN)
| Komponent | Bal |
|-----------|-----|
| Gəlir ratio yoxlaması | 0–100 |

### STANDARD (Priority 2, 2000–10000 AZN)
| Komponent | Bal |
|-----------|-----|
| AKB Score | 0–50 |
| Gəlir ratio | 0–50 |

### DEEP (Priority 3, 10000+ AZN)
| Komponent | Bal |
|-----------|-----|
| AKB Score | 0–40 |
| Credit History | 0–30 |
| Gəlir ratio | 0–30 |

---

## Xarici Xidmətlər Xülasəsi

| Xidmət | Metod | Step | Məlumat |
|--------|-------|------|---------|
| **SMS (Softline)** | Send(phone, text) | 1 | OTP mesajı göndərir |
| **SIMA KYC** | InitSimaKyc(pin, serial, phone) | 3.1 | Şəxsiyyət təsdiqi |
| **ASAN Finance / MyGov** | GetAsanFinance(pin) | 3.2 | Gəlir məlumatları |
| **AKB Score** | GetAkbScore(pin) | 4.1 | Kredit skoru |
| **AKB History** | GetAkbHistory(pin) | 4.1 | Kredit tarixi |
| **Blacklist** | CheckBlacklist(pin) | 4.2 | Qara siyahı yoxlaması |
| **LW Approve** | ApproveLoan(app) | 4.3 | Son kredit təsdiqi |
| **Customer Loans** | GetCustomerLoans(pin) | 4.2 | Mövcud kreditlər |
| **Personal Info** | GetPersonalInfo(pin, serial) | — | ASAN şəxsi məlumatlar |

> Bütün xarici xidmətlər **LW Provider** interfeysi vasitəsilə çağırılır. Real implementasiyada hər biri ayrı API-ya gedir, mock rejimində isə test data qaytarır.