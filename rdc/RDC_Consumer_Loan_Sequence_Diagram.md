# RDC Consumer Loan — Sequence Diagram (Detailed)

> RDC Credit Laddering sisteminin istehlakçı krediti (consumer loan) müraciət prosesinin detallı sequence diaqramı.  
> Bu diaqram RDC_Sequence_Diagram.md-ın istehlakçı krediti üçün xüsusi versiyasıdır.

---

## 1. Sistem Konteksti

RDC (Retail Digital Credit) — istehlakçı krediti üçün digital lending platformasıdır. Müştəri mobil vasitəsilə 6 addımda kredit müraciəti edir:

1. **OTP Verify** — Telefon nömrəsi ilə identifikasiya
2. **Credit Amount Selection** — Məbləğ və məhsul seçimi
3. **SIMA KYC** — Rəqəmi identifikasiya (PIN + SERİAL)
4. **MyGov Income Verification** — Gəlir məlumatlarının təsdiqi
5. **Credit Scoring** — AKB score + Credit Engine scoring
6. **LW Approval** — Son kredit təsdiqi / rədd edilməsi

---

## 2. Aktyorlar və Sistem Sərhədləri

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        RDC System Boundary                               │
│                                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Handler    │  │   Service    │  │  Repository  │  │ CreditEngine │  │
│  │  (HTTP API)  │──│  (Business)  │──│   (Data)     │  │  (Scoring)   │  │
│  └─────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                │                  │                   │         │
│         ▼                ▼                  ▼                   ▼         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                        pkg/ Layer                                 │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────────────┐    │   │
│  │  │  SMS     │  │  OTP     │  │       LW Provider            │    │   │
│  │  │ Provider │  │ Provider │  │  (9 methods, 7+ services)    │    │   │
│  │  └────┬─────┘  └────┬─────┘  └──────────────┬───────────────┘    │   │
│  └───────┼─────────────┼───────────────────────┼────────────────────┘   │
└──────────┼─────────────┼───────────────────────┼────────────────────────┘
           │             │                       │
           ▼             │                       ▼
    ┌───────────┐        │              ┌─────────────────────┐
    │  Softline  │        │              │   External Services  │
    │ SMS GW    │        │              │ ┌─────┐ ┌────┐ ┌───┐ │
    └───────────┘        │              │ │SIMA │ │AKB │ │MyG│ │
                         │              │ └─────┘ └────┘ └───┘ │
                         │              │ ┌─────┐ ┌────┐ ┌───┐ │
                         │              │ │ASAN │ │BLCK│ │LW │ │
                         │              │ └─────┘ └────┘ └───┘ │
                         │              └─────────────────────┘
                         │
                    ┌────┴────┐
                    │SQL Server│
                    │ Express  │
                    └─────────┘
```

---

## 3. Tam Consumer Loan Sequence

### Phase 1: Müraciətin Başlanması (Step 1)

```
Client          Handler          Service          OTPProv   SMSProv   DB
  │                │                │                │         │       │
  │ POST /request  │                │                │         │       │
  │ {phone,name,   │                │                │         │       │
  │  pin,serial}   │                │                │         │       │
  │───────────────>│                │                │         │       │
  │                │ RequestOTP()   │                │         │       │
  │                │───────────────>│                │         │       │
  │                │                │ FindByPhone()  │         │       │
  │                │                │─────────────────────────────────>│
  │                │                │ customer       │         │       │
  │                │                │<─────────────────────────────────│
  │                │                │                │         │       │
  │                │                │ HasPending?    │         │       │
  │                │                │─────────────────────────────────>│
  │                │                │ false          │         │       │
  │                │                │<─────────────────────────────────│
  │                │                │                │         │       │
  │                │                │ Generate()     │         │       │
  │                │                │───────────────>│         │       │
  │                │                │                │ Send()  │       │
  │                │                │                │────────>│       │
  │                │                │                │         │ GET   │
  │                │                │                │         │ /sendsms
  │                │                │                │  OK    │       │
  │                │                │                │<────────│       │
  │                │                │ otp_result     │         │       │
  │                │                │<───────────────│         │       │
  │                │ 200 OK         │                │         │       │
  │<───────────────│                │                │         │       │
  │                │                │                │         │       │
  │ POST /verify   │                │                │         │       │
  │ {phone,code}   │                │                │         │       │
  │───────────────>│                │                │         │       │
  │                │ VerifyOTP()    │                │         │       │
  │                │───────────────>│                │         │       │
  │                │                │ Verify()       │         │       │
  │                │                │───────────────>│         │       │
  │                │                │ true           │         │       │
  │                │                │<───────────────│         │       │
  │                │                │ Create(app)    │         │       │
  │                │                │─────────────────────────────────>│
  │                │                │ app_id=1       │         │       │
  │                │                │<─────────────────────────────────│
  │                │ 200 OK         │                │         │       │
  │<───────────────│ {app_id,status}│                │         │       │
```

### Phase 2: Məbləğ Seçimi (Step 2)

```
Client          Handler          Service          CreditEngine  DB
  │                │                │                  │          │
  │ POST /select   │                │                  │          │
  │ ?app_id=1      │                │                  │          │
  │ {amount:5000}  │                │                  │          │
  │───────────────>│                │                  │          │
  │                │ SelectAmount() │                  │          │
  │                │───────────────>│                  │          │
  │                │                │ FindByID(1)      │          │
  │                │                │─────────────────────────────>│
  │                │                │ app              │          │
  │                │                │<─────────────────────────────│
  │                │                │                  │          │
  │                │                │ DetermineCheckType(5000)    │
  │                │                │─────────────────>│          │
  │                │                │                  │ SELECT   │
  │                │                │                  │ FROM     │
  │                │                │                  │ config   │
  │                │                │ "STANDARD"       │          │
  │                │                │<─────────────────│          │
  │                │                │                  │          │
  │                │                │ Update(app)      │          │
  │                │                │─────────────────────────────>│
  │                │                │                  │          │
  │                │ 200 OK         │                  │          │
  │<───────────────│ {check_type}   │                  │          │
```

### Phase 3: SIMA KYC (Step 3.1)

```
Client          Handler          Service          LWProvider   SIMA
  │                │                │                  │          │
  │ POST /sima     │                │                  │          │
  │ ?app_id=1      │                │                  │          │
  │───────────────>│                │                  │          │
  │                │ InitSimaKyc()  │                  │          │
  │                │───────────────>│                  │          │
  │                │                │ GetPersonalInfo()│          │
  │                │                │─────────────────>│          │
  │                │                │ {pin,serial}     │          │
  │                │                │─────────────────────────────>│
  │                │                │                  │          │
  │                │                │ InitSimaKyc()   │          │
  │                │                │─────────────────>│          │
  │                │                │                  │ KYC req  │
  │                │                │                  │─────────>│
  │                │                │                  │ req_id   │
  │                │                │                  │<─────────│
  │                │                │ {request_id}    │          │
  │                │                │<─────────────────│          │
  │                │ 200 OK         │                  │          │
  │<───────────────│ {sima_req_id}  │                  │          │
```

### Phase 4: MyGov Gəlir (Step 3.2)

```
Client          Handler          Service          LWProvider   MyGov
  │                │                │                  │          │
  │ POST /mygov    │                │                  │          │
  │ ?app_id=1      │                │                  │          │
  │───────────────>│                │                  │          │
  │                │ InitMyGov()    │                  │          │
  │                │───────────────>│                  │          │
  │                │                │ GetAsanFinance()│          │
  │                │                │─────────────────>│          │
  │                │                │                  │ income   │
  │                │                │                  │─────────>│
  │                │                │                  │ accounts │
  │                │                │                  │<─────────│
  │                │                │ {income,debt}   │          │
  │                │                │<─────────────────│          │
  │                │ 200 OK         │                  │          │
  │<───────────────│ {income,ratio} │                  │          │
```

### Phase 5: Scoring + LW (Step 4)

```
Client          Handler          Service          CEngine    LWProv    DB
  │                │                │                  │          │        │
  │ POST /income   │                │                  │          │        │
  │ ?app_id=1      │                │                  │          │        │
  │───────────────>│ VerifyIncome() │                  │          │        │
  │                │───────────────>│ GetAkbScore()    │          │        │
  │                │                │──────────────────────────>│        │
  │                │                │ {score:650}      │          │        │
  │                │                │<──────────────────────────│        │
  │ 200 OK         │                │                  │          │        │
  │<───────────────│                │                  │          │        │
  │                │                │                  │          │        │
  │ POST /lw-approve                │                  │          │        │
  │ ?app_id=1      │                │                  │          │        │
  │───────────────>│ LWApproval()   │                  │          │        │
  │                │───────────────>│ CheckBlacklist() │          │        │
  │                │                │──────────────────────────>│        │
  │                │                │ {not_blacklisted}│          │        │
  │                │                │<──────────────────────────│        │
  │                │                │                  │          │        │
  │                │                │ CalculateScore() │          │        │
  │                │                │─────────────────>│          │        │
  │                │                │ {score:72,      │          │        │
  │                │                │  approved:true}  │          │        │
  │                │                │<─────────────────│          │        │
  │                │ 200 OK         │                  │          │        │
  │<───────────────│ {score:72}     │                  │          │        │
  │                │                │                  │          │        │
  │ GET /lw-decision                │                  │          │        │
  │ ?app_id=1      │                │                  │          │        │
  │───────────────>│ LWDecision()   │                  │          │        │
  │                │───────────────>│ ApproveLoan()    │          │        │
  │                │                │──────────────────────────>│        │
  │                │                │ {success,loan_id}│          │        │
  │                │                │<──────────────────────────│        │
  │                │ 200 OK         │                  │          │        │
  │<───────────────│ {loan_id,      │                  │          │        │
  │                 │  approved:true}│                  │          │        │
```

---

## 4. Error Handling Aktyorları

| Error Tipi | Step | HTTP Status | Response |
|------------|------|-------------|----------|
| Aktiv müraciət var | 1.1 | 400 | "customer already has a pending application" |
| OTP müddəti bitib | 1.2 | 400 | "OTP expired" |
| OTP cəhd limiti (3) | 1.2 | 400 | "OTP attempt limit exceeded" |
| Yanlış OTP kodu | 1.2 | 400 | "invalid OTP code" |
| Səhv status keçidi | 2, 3, 4 | 400 | "invalid status: expected X, got Y" |
| Müraciət tapılmadı | 2, 3, 4 | 400 | "application not found" |
| Blacklist | 4.2 | 400 | "customer is blacklisted: {reason}" |
| SMS göndərmə xətası | 1.1 | 400 | "SMS send failed: errno={n}" |
| DB xətası | hər yerdə | 500 | "database error" / internal message |

---

## 5. Timeout və Retry Siyasəti

| Əməliyyat | Timeout | Retry | Izah |
|-----------|---------|-------|------|
| SMS göndərmə | 10 saniyə | 1 dəfə | Softline cavabı gözlənilir |
| SIMA KYC | 30 saniyə | 0 | Async — status poll ilə yoxlanılır |
| MyGov / ASAN | 30 saniyə | 0 | Async — status poll ilə yoxlanılır |
| AKB Score | 15 saniyə | 1 dəfə | Kredit bürosu sorğusu |
| LW Approve | 30 saniyə | 0 | Async — status poll ilə yoxlanılır |
| DB əməliyyat | 5 saniyə | 2 dəfə | SQL Server connection |

---

## 6. Data Flow Summary

```
Step 1 Input → phone, full_name, pin, serial, birth_date
Step 1 Output → application_id, status=otp_verified

Step 2 Input → application_id, amount, product_code
Step 2 Output → check_type, status=step2_completed

Step 3.1 Input → application_id
Step 3.1 Output → sima_request_id, status=sima_verified

Step 3.2 Input → application_id
Step 3.2 Output → monthly_income, debt_ratio, status=mygov_verified

Step 4.1 Input → application_id
Step 4.1 Output → akb_score, risk_level, status=income_verified

Step 4.2 Input → application_id
Step 4.2 Output → credit_score, check_type, status=lw_approve_pending

Step 4.3 Input → application_id
Step 4.3 Output → loan_id, status=approved/rejected
```