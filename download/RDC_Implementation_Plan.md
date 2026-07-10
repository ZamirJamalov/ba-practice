# RDC (Credit Laddering) — Implementation Plan

> **Tech Stack**: Plain Go (`net/http`, `database/sql`, `encoding/json`) + SQL Server Express  
> **Architecture**: Handler → Service → Repository (3-layer)  
> **Config**: Environment variables + fallback defaults  
> **External Providers**: LW Provider, SMS Provider (Softline), OTP Provider  
> **Branch**: `main`  
> **Repo**: `ZamirJamalov/ba-practice` → `rdc/source/`

---

## Status Flow

```
otp_pending
  → otp_verified
    → step2_completed
      → sima_kyc_pending
        → sima_verified
          → mygov_pending
            → mygov_verified
              → income_verified
                → lw_approve_pending
                  → approved / rejected
```

---

## External Providers Summary

### 1. LW Provider (`pkg/lw/`)
Abstraktlaşdırılmış 8 metoddan ibarət interfeys. 7+ xarici xidməti (ASAN, AKB, SIMA, MyGov, Blacklist, və s.) birləşdirir.

### 2. SMS Provider (`pkg/sms/`)
Softline SMS Gateway ilə inteqrasiya.

### 3. OTP Provider (`pkg/otp/`)
SMS Provider-ə bağlıdır. OTP generasiya, saxlama və verify edir.

---

## Config (`config/config.go`)

```go
package config

import "os"

type Config struct {
    DBHost     string
    DBPort     string
    DBUser     string
    DBPassword string
    DBName     string
    
    SMSProvider    string // "softline" | "mock"
    SoftlineUser   string
    SoftlinePass   string
    SoftlineURL    string
    
    LWProvider     string // "mock" | "real"
    
    OTPLength      int
    OTPExpirySec   int
}

func Load() *Config {
    return &Config{
        DBHost:     getEnv("DB_HOST", "localhost"),
        DBPort:     getEnv("DB_PORT", "1433"),
        DBUser:     getEnv("DB_USER", "sa"),
        DBPassword: getEnv("DB_PASSWORD", "MySecretPassword123!"),
        DBName:     getEnv("DB_NAME", "rdc"),
        
        SMSProvider:    getEnv("SMS_PROVIDER", "softline"),
        SoftlineUser:   getEnv("SOFTLINE_USER", "softlinetestapi"),
        SoftlinePass:   getEnv("SOFTLINE_PASS", "ZXe5Gk1G"),
        SoftlineURL:    getEnv("SOFTLINE_URL", "http://gw.softline.az/sendsms"),
        
        LWProvider:     getEnv("LW_PROVIDER", "mock"),
        
        OTPLength:      6,
        OTPExpirySec:   120,
    }
}

func getEnv(key, fallback string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return fallback
}
```

---

## Database Migration (`migrations/001_init.sql`)

```sql
-- RDC Database Schema
-- SQL Server Express

DROP TABLE IF EXISTS loan_applications;
DROP TABLE IF EXISTS otp_attempts;
DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
    id              INT IDENTITY(1,1) PRIMARY KEY,
    phone           NVARCHAR(20)  NOT NULL UNIQUE,
    full_name       NVARCHAR(200) NOT NULL,
    pin             NVARCHAR(10)  NOT NULL,
    serial          NVARCHAR(2)   NOT NULL,
    birth_date      DATE          NOT NULL,
    created_at      DATETIME DEFAULT GETDATE()
);

CREATE TABLE otp_attempts (
    id              INT IDENTITY(1,1) PRIMARY KEY,
    customer_id     INT           NOT NULL,
    phone           NVARCHAR(20)  NOT NULL,
    code            NVARCHAR(6)   NOT NULL,
    attempts        INT           DEFAULT 0,
    expires_at      DATETIME      NOT NULL,
    verified        BIT           DEFAULT 0,
    created_at      DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_otp_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE loan_applications (
    id                  INT IDENTITY(1,1) PRIMARY KEY,
    customer_id         INT           NOT NULL,
    status              NVARCHAR(50)  NOT NULL DEFAULT 'otp_pending',
    
    -- Step 2: Credit amount
    requested_amount    DECIMAL(18,2) NULL,
    product_code        NVARCHAR(50)  NULL,
    
    -- Step 3: SIMA KYC
    sima_request_id     NVARCHAR(100) NULL,
    sima_status         NVARCHAR(50)  NULL,
    
    -- Step 4: MyGov
    mygov_request_id    NVARCHAR(100) NULL,
    mygov_status        NVARCHAR(50)  NULL,
    
    -- Income verification
    monthly_income      DECIMAL(18,2) NULL,
    debt_ratio          DECIMAL(5,2)  NULL,
    
    -- LW approval
    lw_request_id       NVARCHAR(100) NULL,
    lw_status           NVARCHAR(50)  NULL,
    lw_response_data    NVARCHAR(MAX) NULL,
    
    -- Credit engine result
    credit_score        INT           NULL,
    check_type_used     NVARCHAR(50)  NULL,
    
    created_at          DATETIME DEFAULT GETDATE(),
    updated_at          DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_app_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Check type configuration for credit engine
-- Priority 1-3: hər bir müraciət üçün bir dəfə istifadə olunur
DROP TABLE IF EXISTS check_type_config;
CREATE TABLE check_type_config (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    check_type  NVARCHAR(50)  NOT NULL UNIQUE,
    priority    INT           NOT NULL,
    min_amount  DECIMAL(18,2) NULL,
    max_amount  DECIMAL(18,2) NULL,
    is_active   BIT           DEFAULT 1,
    created_at  DATETIME DEFAULT GETDATE()
);

INSERT INTO check_type_config (check_type, priority, min_amount, max_amount) VALUES
('SIMPLE',   1, 0,      2000),
('STANDARD', 2, 2000.01, 10000),
('DEEP',     3, 10000.01, NULL);

CREATE INDEX idx_applications_status ON loan_applications(status);
CREATE INDEX idx_applications_customer ON loan_applications(customer_id);
CREATE INDEX idx_otp_phone ON otp_attempts(phone);
```

---

## Faz A — Project Structure & SMS Provider (Steps 1-5)

### Step 1: Go Module Init

**Fayl**: `rdc/source/go.mod`

```
module rdc

go 1.21

require (
    github.com/denisenkom/go-mssqldb v2.0.0+incompatible
)
```

**Əməliyyat**:
```bash
cd rdc/source
go mod init rdc
go get github.com/denisenkom/go-mssqldb
```

---

### Step 2: SMS Provider Interface

**Fayl**: `rdc/source/pkg/sms/provider.go`

```go
package sms

// Provider SMS göndərmə xidməti üçün interfeys
type Provider interface {
    Send(phone string, text string) (*SendResult, error)
}

type SendResult struct {
    Success   bool
    MessageID string
    Charge    int
    Balance   float64
    ErrNo     int
    ErrText   string
}
```

---

### Step 3: Softline SMS HTTP Implementation

**Fayl**: `rdc/source/pkg/sms/softline.go`

```go
package sms

import (
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "net/url"
    "strconv"
    "strings"
)

type SoftlineProvider struct {
    User   string
    Pass   string
    URL    string
    Client *http.Client
}

func NewSoftlineProvider(user, pass, baseURL string) *SoftlineProvider {
    return &SoftlineProvider{
        User:   user,
        Pass:   pass,
        URL:    baseURL,
        Client: &http.Client{},
    }
}

func (s *SoftlineProvider) Send(phone string, text string) (*SendResult, error) {
    // Phone format: +994XX... → 994XX...
    cleanPhone := strings.TrimPrefix(phone, "+")
    
    reqURL := fmt.Sprintf("%s?user=%s&password=%s&gsm=%s&from=SOFTLINE&text=%s",
        s.URL,
        url.QueryEscape(s.User),
        url.QueryEscape(s.Pass),
        url.QueryEscape(cleanPhone),
        url.QueryEscape(text),
    )
    
    resp, err := s.Client.Get(reqURL)
    if err != nil {
        return &SendResult{Success: false, ErrNo: -1, ErrText: err.Error()}, nil
    }
    defer resp.Body.Close()
    
    body, _ := io.ReadAll(resp.Body)
    result := parseSoftlineResponse(string(body))
    
    return result, nil
}

func parseSoftlineResponse(body string) *SendResult {
    result := &SendResult{}
    parts := strings.Split(body, "&")
    for _, part := range parts {
        kv := strings.SplitN(part, "=", 2)
        if len(kv) != 2 {
            continue
        }
        switch kv[0] {
        case "errno":
            n, _ := strconv.Atoi(kv[1])
            result.ErrNo = n
            result.Success = (n == 100)
        case "errtext":
            result.ErrText = kv[1]
        case "message_id":
            result.MessageID = kv[1]
        case "charge":
            result.Charge, _ = strconv.Atoi(kv[1])
        case "balance":
            result.Balance, _ = strconv.ParseFloat(kv[1], 64)
        }
    }
    return result
}

// Softline Error Codes
const (
    ErrCodeOK              = 100
    ErrCodeMissingParam    = 0
    ErrCodeInvalidMSISDN   = 20
    ErrCodeBlacklisted     = 25
    ErrCodeInvalidCred     = 40
    ErrCodeLowBalance      = 60
    ErrCodeServerError     = 200
)
```

---

### Step 4: Mock SMS Provider

**Fayl**: `rdc/source/pkg/sms/mock_provider.go`

```go
package sms

import (
    "fmt"
    "math/rand"
    "time"
)

type MockProvider struct{}

func NewMockProvider() *MockProvider {
    return &MockProvider{}
}

func (m *MockProvider) Send(phone string, text string) (*SendResult, error) {
    return &SendResult{
        Success:   true,
        MessageID: fmt.Sprintf("mock_%d", time.Now().UnixNano()),
        Charge:    0,
        Balance:   999.99,
        ErrNo:     ErrCodeOK,
        ErrText:   "OK",
    }, nil
}

func init() {
    rand.Seed(time.Now().UnixNano())
}
```

---

### Step 5: SMS Config Integration

**Fayl**: `rdc/source/pkg/sms/factory.go`

```go
package sms

import "rdc/config"

func NewProvider(cfg *config.Config) Provider {
    switch cfg.SMSProvider {
    case "softline":
        return NewSoftlineProvider(cfg.SoftlineUser, cfg.SoftlinePass, cfg.SoftlineURL)
    default:
        return NewMockProvider()
    }
}
```

---

## Faz B — OTP Provider (Steps 6-9)

### Step 6: OTP Provider Interface

**Fayl**: `rdc/source/pkg/otp/provider.go`

```go
package otp

import "database/sql"

// Provider OTP generasiya və verify üçün interfeys
type Provider interface {
    Generate(customerID int, phone string) (*OTPResult, error)
    Verify(customerID int, code string) (bool, error)
}

type OTPResult struct {
    Code     string
    ExpiresAt string
}
```

---

### Step 7: OTP Implementation (DB + SMS)

**Fayl**: `rdc/source/pkg/otp/db_provider.go`

OTP provider SMS provider-ə bağlıdır. OTP yaradır, bazaya yazır, SMS göndərir.

```go
package otp

import (
    "database/sql"
    "fmt"
    "math/rand"
    "rdc/config"
    "rdc/pkg/sms"
    "time"
)

type DBProvider struct {
    db        *sql.DB
    sms       sms.Provider
    otpLength int
    expirySec int
}

func NewDBProvider(db *sql.DB, smsProvider sms.Provider, cfg *config.Config) *DBProvider {
    return &DBProvider{
        db:        db,
        sms:       smsProvider,
        otpLength: cfg.OTPLength,
        expirySec: cfg.OTPExpirySec,
    }
}

func (p *DBProvider) Generate(customerID int, phone string) (*OTPResult, error) {
    code := p.generateCode()
    expiresAt := time.Now().Add(time.Duration(p.expirySec) * time.Second)
    
    // Əvvəlki aktiv OTP-ləri deaktiv et
    _, err := p.db.Exec(
        "UPDATE otp_attempts SET verified = 1 WHERE customer_id = @p1 AND verified = 0",
        customerID,
    )
    if err != nil {
        return nil, fmt.Errorf("previous OTP deactivation failed: %w", err)
    }
    
    // Yeni OTP yaradıb saxla
    _, err = p.db.Exec(
        `INSERT INTO otp_attempts (customer_id, phone, code, attempts, expires_at, verified)
         VALUES (@p1, @p2, @p3, 0, @p4, 0)`,
        customerID, phone, code, expiresAt,
    )
    if err != nil {
        return nil, fmt.Errorf("OTP insert failed: %w", err)
    }
    
    // SMS göndər
    smsText := fmt.Sprintf("RDC: Sizin təsdiq kodunuz %s", code)
    result, err := p.sms.Send(phone, smsText)
    if err != nil {
        return nil, fmt.Errorf("SMS send failed: %w", err)
    }
    if !result.Success {
        return nil, fmt.Errorf("SMS send failed: errno=%d, errtext=%s", result.ErrNo, result.ErrText)
    }
    
    return &OTPResult{
        Code:      code,
        ExpiresAt: expiresAt.Format(time.RFC3339),
    }, nil
}

func (p *DBProvider) Verify(customerID int, code string) (bool, error) {
    var dbCode string
    var attempts int
    var expiresAt time.Time
    var verified bool
    
    err := p.db.QueryRow(
        `SELECT code, attempts, expires_at, verified
         FROM otp_attempts
         WHERE customer_id = @p1 AND verified = 0
         ORDER BY created_at DESC`,
        customerID,
    ).Scan(&dbCode, &attempts, &expiresAt, &verified)
    
    if err == sql.ErrNoRows {
        return false, fmt.Errorf("no active OTP found")
    }
    if err != nil {
        return false, fmt.Errorf("OTP query failed: %w", err)
    }
    
    // Vaxt check
    if time.Now().After(expiresAt) {
        return false, fmt.Errorf("OTP expired")
    }
    
    // Cəhd limiti (maksimum 3)
    if attempts >= 3 {
        return false, fmt.Errorf("OTP attempt limit exceeded")
    }
    
    // Cəhdi artır
    p.db.Exec(
        "UPDATE otp_attempts SET attempts = attempts + 1 WHERE customer_id = @p1 AND verified = 0",
        customerID,
    )
    
    // Kod yoxla
    if dbCode != code {
        return false, nil
    }
    
    // Uğurlu verify
    _, err = p.db.Exec(
        "UPDATE otp_attempts SET verified = 1 WHERE customer_id = @p1 AND verified = 0",
        customerID,
    )
    if err != nil {
        return false, fmt.Errorf("OTP verify update failed: %w", err)
    }
    
    return true, nil
}

func (p *DBProvider) generateCode() string {
    digits := "0123456789"
    code := make([]byte, p.otpLength)
    for i := 0; i < p.otpLength; i++ {
        code[i] = digits[rand.Intn(len(digits))]
    }
    return string(code)
}
```

---

### Step 8: Mock OTP Provider

**Fayl**: `rdc/source/pkg/otp/mock_provider.go`

```go
package otp

import (
    "database/sql"
    "fmt"
    "rdc/pkg/sms"
)

type MockOTPProvider struct {
    db  *sql.DB
    sms sms.Provider
}

func NewMockProvider(db *sql.DB, smsProvider sms.Provider) *MockOTPProvider {
    return &MockOTPProvider{db: db, sms: smsProvider}
}

func (m *MockOTPProvider) Generate(customerID int, phone string) (*OTPResult, error) {
    // Mock: həmişə "123456" kodu göndərir
    _, err := m.db.Exec(
        `INSERT INTO otp_attempts (customer_id, phone, code, attempts, expires_at, verified)
         VALUES (@p1, @p2, '123456', 0, DATEADD(MINUTE, 5, GETDATE()), 0)`,
        customerID, phone,
    )
    if err != nil {
        return nil, fmt.Errorf("mock OTP insert failed: %w", err)
    }
    
    return &OTPResult{Code: "123456", ExpiresAt: "2099-12-31T23:59:59Z"}, nil
}

func (m *MockOTPProvider) Verify(customerID int, code string) (bool, error) {
    if code == "123456" {
        _, err := m.db.Exec(
            "UPDATE otp_attempts SET verified = 1 WHERE customer_id = @p1 AND verified = 0",
            customerID,
        )
        if err != nil {
            return false, err
        }
        return true, nil
    }
    return false, nil
}
```

---

### Step 9: OTP Factory

**Fayl**: `rdc/source/pkg/otp/factory.go`

```go
package otp

import (
    "database/sql"
    "rdc/config"
    "rdc/pkg/sms"
)

func NewProvider(db *sql.DB, smsProvider sms.Provider, cfg *config.Config) Provider {
    switch cfg.LWProvider {
    case "mock":
        return NewMockProvider(db, smsProvider)
    default:
        return NewDBProvider(db, smsProvider, cfg)
    }
}
```

---

## Faz C — Application & Step 1: OTP (Steps 10-14)

### Step 10: Customer Repository

**Fayl**: `rdc/source/internal/repository/customer_repo.go`

```go
package repository

import (
    "database/sql"
    "rdc/internal/model"
)

type CustomerRepository struct {
    db *sql.DB
}

func NewCustomerRepository(db *sql.DB) *CustomerRepository {
    return &CustomerRepository{db: db}
}

func (r *CustomerRepository) FindByPhone(phone string) (*model.Customer, error) {
    var c model.Customer
    err := r.db.QueryRow(
        "SELECT id, phone, full_name, pin, serial, birth_date, created_at FROM customers WHERE phone = @p1",
        phone,
    ).Scan(&c.ID, &c.Phone, &c.FullName, &c.PIN, &c.Serial, &c.BirthDate, &c.CreatedAt)
    if err == sql.ErrNoRows {
        return nil, nil
    }
    if err != nil {
        return nil, err
    }
    return &c, nil
}

func (r *CustomerRepository) FindByID(id int) (*model.Customer, error) {
    var c model.Customer
    err := r.db.QueryRow(
        "SELECT id, phone, full_name, pin, serial, birth_date, created_at FROM customers WHERE id = @p1",
        id,
    ).Scan(&c.ID, &c.Phone, &c.FullName, &c.PIN, &c.Serial, &c.BirthDate, &c.CreatedAt)
    if err == sql.ErrNoRows {
        return nil, nil
    }
    if err != nil {
        return nil, err
    }
    return &c, nil
}

func (r *CustomerRepository) Create(c *model.Customer) (int, error) {
    var id int
    err := r.db.QueryRow(
        `INSERT INTO customers (phone, full_name, pin, serial, birth_date)
         VALUES (@p1, @p2, @p3, @p4, @p5);
         SELECT SCOPE_IDENTITY();`,
        c.Phone, c.FullName, c.PIN, c.Serial, c.BirthDate,
    ).Scan(&id)
    if err != nil {
        return 0, err
    }
    c.ID = id
    return id, nil
}

// HasPendingApplication — müştərinin aktiv (pending) müraciəti varmı?
func (r *CustomerRepository) HasPendingApplication(customerID int) (bool, error) {
    var count int
    err := r.db.QueryRow(
        `SELECT COUNT(*) FROM loan_applications
         WHERE customer_id = @p1
           AND status NOT IN ('approved', 'rejected')`,
        customerID,
    ).Scan(&count)
    if err != nil {
        return false, err
    }
    return count > 0, nil
}
```

---

### Step 11: Application Repository

**Fayl**: `rdc/source/internal/repository/application_repo.go`

```go
package repository

import (
    "database/sql"
    "rdc/internal/model"
)

type ApplicationRepository struct {
    db *sql.DB
}

func NewApplicationRepository(db *sql.DB) *ApplicationRepository {
    return &ApplicationRepository{db: db}
}

func (r *ApplicationRepository) Create(app *model.LoanApplication) (int, error) {
    var id int
    err := r.db.QueryRow(
        `INSERT INTO loan_applications (customer_id, status)
         VALUES (@p1, @p2);
         SELECT SCOPE_IDENTITY();`,
        app.CustomerID, app.Status,
    ).Scan(&id)
    if err != nil {
        return 0, err
    }
    app.ID = id
    return id, nil
}

func (r *ApplicationRepository) FindByID(id int) (*model.LoanApplication, error) {
    var app model.LoanApplication
    err := r.db.QueryRow(
        `SELECT id, customer_id, status, requested_amount, product_code,
                sima_request_id, sima_status, mygov_request_id, mygov_status,
                monthly_income, debt_ratio, lw_request_id, lw_status,
                lw_response_data, credit_score, check_type_used,
                created_at, updated_at
         FROM loan_applications WHERE id = @p1`,
        id,
    ).Scan(
        &app.ID, &app.CustomerID, &app.Status,
        &app.RequestedAmount, &app.ProductCode,
        &app.SimaRequestID, &app.SimaStatus,
        &app.MyGovRequestID, &app.MyGovStatus,
        &app.MonthlyIncome, &app.DebtRatio,
        &app.LWRequestID, &app.LWStatus, &app.LWResponseData,
        &app.CreditScore, &app.CheckTypeUsed,
        &app.CreatedAt, &app.UpdatedAt,
    )
    if err == sql.ErrNoRows {
        return nil, nil
    }
    if err != nil {
        return nil, err
    }
    return &app, nil
}

func (r *ApplicationRepository) FindByCustomerID(customerID int) (*model.LoanApplication, error) {
    var app model.LoanApplication
    err := r.db.QueryRow(
        `SELECT TOP 1 id, customer_id, status, requested_amount, product_code,
                sima_request_id, sima_status, mygov_request_id, mygov_status,
                monthly_income, debt_ratio, lw_request_id, lw_status,
                lw_response_data, credit_score, check_type_used,
                created_at, updated_at
         FROM loan_applications
         WHERE customer_id = @p1 AND status NOT IN ('approved', 'rejected')
         ORDER BY created_at DESC`,
        customerID,
    ).Scan(
        &app.ID, &app.CustomerID, &app.Status,
        &app.RequestedAmount, &app.ProductCode,
        &app.SimaRequestID, &app.SimaStatus,
        &app.MyGovRequestID, &app.MyGovStatus,
        &app.MonthlyIncome, &app.DebtRatio,
        &app.LWRequestID, &app.LWStatus, &app.LWResponseData,
        &app.CreditScore, &app.CheckTypeUsed,
        &app.CreatedAt, &app.UpdatedAt,
    )
    if err == sql.ErrNoRows {
        return nil, nil
    }
    if err != nil {
        return nil, err
    }
    return &app, nil
}

func (r *ApplicationRepository) UpdateStatus(id int, status string) error {
    _, err := r.db.Exec(
        "UPDATE loan_applications SET status = @p1, updated_at = GETDATE() WHERE id = @p2",
        status, id,
    )
    return err
}

func (r *ApplicationRepository) Update(id int, app *model.LoanApplication) error {
    _, err := r.db.Exec(
        `UPDATE loan_applications SET
            status = @p1,
            requested_amount = @p2,
            product_code = @p3,
            sima_request_id = @p4,
            sima_status = @p5,
            mygov_request_id = @p6,
            mygov_status = @p7,
            monthly_income = @p8,
            debt_ratio = @p9,
            lw_request_id = @p10,
            lw_status = @p11,
            lw_response_data = @p12,
            credit_score = @p13,
            check_type_used = @p14,
            updated_at = GETDATE()
         WHERE id = @p15`,
        app.Status, app.RequestedAmount, app.ProductCode,
        app.SimaRequestID, app.SimaStatus,
        app.MyGovRequestID, app.MyGovStatus,
        app.MonthlyIncome, app.DebtRatio,
        app.LWRequestID, app.LWStatus, app.LWResponseData,
        app.CreditScore, app.CheckTypeUsed,
        id,
    )
    return err
}
```

---

### Step 12: Models

**Fayl**: `rdc/source/internal/model/models.go`

```go
package model

import "time"

type Customer struct {
    ID        int       `json:"id"`
    Phone     string    `json:"phone"`
    FullName  string    `json:"full_name"`
    PIN       string    `json:"pin"`
    Serial    string    `json:"serial"`
    BirthDate time.Time `json:"birth_date"`
    CreatedAt time.Time `json:"created_at"`
}

type LoanApplication struct {
    ID             int       `json:"id"`
    CustomerID     int       `json:"customer_id"`
    Status         string    `json:"status"`
    RequestedAmount *float64 `json:"requested_amount,omitempty"`
    ProductCode    *string   `json:"product_code,omitempty"`
    SimaRequestID  *string   `json:"sima_request_id,omitempty"`
    SimaStatus     *string   `json:"sima_status,omitempty"`
    MyGovRequestID *string   `json:"mygov_request_id,omitempty"`
    MyGovStatus    *string   `json:"mygov_status,omitempty"`
    MonthlyIncome  *float64  `json:"monthly_income,omitempty"`
    DebtRatio      *float64  `json:"debt_ratio,omitempty"`
    LWRequestID    *string   `json:"lw_request_id,omitempty"`
    LWStatus       *string   `json:"lw_status,omitempty"`
    LWResponseData *string   `json:"lw_response_data,omitempty"`
    CreditScore    *int      `json:"credit_score,omitempty"`
    CheckTypeUsed  *string   `json:"check_type_used,omitempty"`
    CreatedAt      time.Time `json:"created_at"`
    UpdatedAt      time.Time `json:"updated_at"`
}
```

---

### Step 13: Application Service

**Fayl**: `rdc/source/internal/service/application_service.go`

```go
package service

import (
    "fmt"
    "rdc/internal/model"
    "rdc/internal/repository"
    "rdc/pkg/otp"
)

type ApplicationService struct {
    customerRepo    *repository.CustomerRepository
    applicationRepo *repository.ApplicationRepository
    otpProvider     otp.Provider
}

func NewApplicationService(
    customerRepo *repository.CustomerRepository,
    applicationRepo *repository.ApplicationRepository,
    otpProvider otp.Provider,
) *ApplicationService {
    return &ApplicationService{
        customerRepo:    customerRepo,
        applicationRepo: applicationRepo,
        otpProvider:     otpProvider,
    }
}

// RequestOTP — Step 1: OTP göndərmək
func (s *ApplicationService) RequestOTP(phone, fullName, pin, serial string, birthDate string) (map[string]interface{}, error) {
    // Müştərini tap və ya yarad
    customer, err := s.customerRepo.FindByPhone(phone)
    if err != nil {
        return nil, fmt.Errorf("customer lookup failed: %w", err)
    }
    
    if customer == nil {
        // Yeni müştəri yaradılır
        customer = &model.Customer{
            Phone:    phone,
            FullName: fullName,
            PIN:      pin,
            Serial:   serial,
        }
        _, err := s.customerRepo.Create(customer)
        if err != nil {
            return nil, fmt.Errorf("customer creation failed: %w", err)
        }
    }
    
    // Aktiv müraciət varmı?
    hasPending, err := s.customerRepo.HasPendingApplication(customer.ID)
    if err != nil {
        return nil, fmt.Errorf("pending check failed: %w", err)
    }
    if hasPending {
        return nil, fmt.Errorf("customer already has a pending application")
    }
    
    // OTP göndər
    otpResult, err := s.otpProvider.Generate(customer.ID, phone)
    if err != nil {
        return nil, fmt.Errorf("OTP generation failed: %w", err)
    }
    
    return map[string]interface{}{
        "message":    "OTP sent successfully",
        "expires_at": otpResult.ExpiresAt,
    }, nil
}

// VerifyOTP — Step 1: OTP təsdiqləmək
func (s *ApplicationService) VerifyOTP(phone, code string) (map[string]interface{}, error) {
    customer, err := s.customerRepo.FindByPhone(phone)
    if err != nil {
        return nil, err
    }
    if customer == nil {
        return nil, fmt.Errorf("customer not found")
    }
    
    verified, err := s.otpProvider.Verify(customer.ID, code)
    if err != nil {
        return nil, err
    }
    if !verified {
        return nil, fmt.Errorf("invalid OTP code")
    }
    
    // OTP verified → müraciət yarad
    appID, err := s.applicationRepo.Create(&model.LoanApplication{
        CustomerID: customer.ID,
        Status:     "otp_verified",
    })
    if err != nil {
        return nil, fmt.Errorf("application creation failed: %w", err)
    }
    
    return map[string]interface{}{
        "message":          "OTP verified, application created",
        "application_id":   appID,
        "status":           "otp_verified",
    }, nil
}
```

---

### Step 14: Application Handlers

**Fayl**: `rdc/source/internal/handler/application_handler.go`

```go
package handler

import (
    "encoding/json"
    "net/http"
    "rdc/internal/service"
)

type ApplicationHandler struct {
    service *service.ApplicationService
}

func NewApplicationHandler(svc *service.ApplicationService) *ApplicationHandler {
    return &ApplicationHandler{service: svc}
}

type requestOTPRequest struct {
    Phone     string `json:"phone"`
    FullName  string `json:"full_name"`
    PIN       string `json:"pin"`
    Serial    string `json:"serial"`
    BirthDate string `json:"birth_date"`
}

type verifyOTPRequest struct {
    Phone string `json:"phone"`
    Code  string `json:"code"`
}

func (h *ApplicationHandler) RequestOTP(w http.ResponseWriter, r *http.Request) {
    var req requestOTPRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        writeError(w, http.StatusBadRequest, "invalid request body")
        return
    }
    
    if req.Phone == "" || req.FullName == "" || req.PIN == "" || req.Serial == "" {
        writeError(w, http.StatusBadRequest, "phone, full_name, pin, serial are required")
        return
    }
    
    result, err := h.service.RequestOTP(req.Phone, req.FullName, req.PIN, req.Serial, req.BirthDate)
    if err != nil {
        writeError(w, http.StatusBadRequest, err.Error())
        return
    }
    
    writeJSON(w, http.StatusOK, result)
}

func (h *ApplicationHandler) VerifyOTP(w http.ResponseWriter, r *http.Request) {
    var req verifyOTPRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        writeError(w, http.StatusBadRequest, "invalid request body")
        return
    }
    
    if req.Phone == "" || req.Code == "" {
        writeError(w, http.StatusBadRequest, "phone and code are required")
        return
    }
    
    result, err := h.service.VerifyOTP(req.Phone, req.Code)
    if err != nil {
        writeError(w, http.StatusBadRequest, err.Error())
        return
    }
    
    writeJSON(w, http.StatusOK, result)
}

// Helper functions
func writeJSON(w http.ResponseWriter, status int, data interface{}) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(data)
}

func writeError(w http.ResponseWriter, status int, message string) {
    writeJSON(w, status, map[string]string{"error": message})
}
```

---

## Faz D — Step 2: Credit Amount Selection (Steps 15-17)

### Step 15: Credit Engine — Check Type Selection

**Fayl**: `rdc/source/internal/service/credit_engine_check.go`

```go
package service

import (
    "database/sql"
    "fmt"
)

// CreditEngine — müraciət məbləğinə əsasən check_type müəyyən edir
type CreditEngine struct {
    db *sql.DB
}

func NewCreditEngine(db *sql.DB) *CreditEngine {
    return &CreditEngine{db: db}
}

// DetermineCheckType — məbləğə əsasən check_type tapır (priority 1-3)
func (ce *CreditEngine) DetermineCheckType(amount float64) (string, error) {
    var checkType string
    err := ce.db.QueryRow(
        `SELECT TOP 1 check_type FROM check_type_config
         WHERE is_active = 1
           AND (min_amount IS NULL OR amount >= min_amount)
           AND (max_amount IS NULL OR amount <= max_amount)
         ORDER BY priority`,
        amount,
    ).Scan(&checkType)
    if err == sql.ErrNoRows {
        return "SIMPLE", nil // fallback
    }
    if err != nil {
        return "", fmt.Errorf("check_type query failed: %w", err)
    }
    return checkType, nil
}
```

---

### Step 16: Credit Engine — Scoring Logic

**Fayl**: `rdc/source/internal/service/credit_engine_score.go`

```go
package service

import "rdc/internal/model"

// ScoreResult — credit engine scoring nəticəsi
type ScoreResult struct {
    Score       int     `json:"score"`
    CheckType   string  `json:"check_type"`
    Approved    bool    `json:"approved"`
    MaxAmount   float64 `json:"max_amount"`
    Reason      string  `json:"reason,omitempty"`
}

// CalculateScore — check_type-ə əsasən scoring hesablayır
// Hər bir check_type üçün fərqli qaydalar:
//   SIMPLE:  sadə rəqəmsal yoxlama
//   STANDARD: orta səviyyəli analiz
//   DEEP: dərin analiz (AKB score, ASAN finance, credit history)
func (ce *CreditEngine) CalculateScore(app *model.LoanApplication, lwData map[string]interface{}) *ScoreResult {
    checkType := "SIMPLE"
    if app.CheckTypeUsed != nil {
        checkType = *app.CheckTypeUsed
    }
    
    var score int
    
    switch checkType {
    case "DEEP":
        // AKB Score: 0-700 aralığını 0-40 balə çevir
        score += getAKBScorePortion(lwData)
        // Credit history: 0-30 bal
        score += getCreditHistoryPortion(lwData)
        // Income ratio: 0-30 bal
        score += getIncomeRatioPortion(app)
        
    case "STANDARD":
        // AKB Score: 0-50 bal
        score += getAKBScorePortion(lwData)
        // Income ratio: 0-50 bal
        score += getIncomeRatioPortion(app)
        
    default: // SIMPLE
        // Sadə yoxlama: income-based 0-100 bal
        score += getIncomeRatioPortion(app)
    }
    
    if score > 100 {
        score = 100
    }
    
    // Təsdiq meyarları
    approved := false
    maxAmount := 0.0
    reason := ""
    
    if score >= 70 {
        approved = true
        if score >= 85 {
            maxAmount = 10000
        } else {
            maxAmount = 5000
        }
    } else if score >= 50 {
        reason = "additional_documents_required"
    } else {
        reason = "score_too_low"
    }
    
    return &ScoreResult{
        Score:     score,
        CheckType: checkType,
        Approved:  approved,
        MaxAmount: maxAmount,
        Reason:    reason,
    }
}

func getAKBScorePortion(data map[string]interface{}) int {
    // LW-dən gələn AKB score-nu bal'a çevirir
    // Real implementasiyada LW provider-dən alınır
    return 35 // placeholder
}

func getCreditHistoryPortion(data map[string]interface{}) int {
    return 25 // placeholder
}

func getIncomeRatioPortion(app *model.LoanApplication) int {
    if app.MonthlyIncome == nil || app.DebtRatio == nil {
        return 30 // placeholder when no data
    }
    return 40 // placeholder
}
```

---

### Step 17: Step 2 Service + Handler

**Fayl**: `rdc/source/internal/service/step2_service.go`

```go
package service

import (
    "fmt"
    "rdc/internal/model"
    "rdc/internal/repository"
)

type Step2Service struct {
    appRepo       *repository.ApplicationRepository
    creditEngine  *CreditEngine
}

func NewStep2Service(appRepo *repository.ApplicationRepository, ce *CreditEngine) *Step2Service {
    return &Step2Service{appRepo: appRepo, creditEngine: ce}
}

// SelectCreditAmount — Step 2: Məbləğ seçimi
func (s *Step2Service) SelectCreditAmount(applicationID int, amount float64, productCode string) (map[string]interface{}, error) {
    app, err := s.appRepo.FindByID(applicationID)
    if err != nil {
        return nil, err
    }
    if app == nil {
        return nil, fmt.Errorf("application not found")
    }
    if app.Status != "otp_verified" {
        return nil, fmt.Errorf("invalid status: expected otp_verified, got %s", app.Status)
    }
    
    // Check type müəyyən et
    checkType, err := s.creditEngine.DetermineCheckType(amount)
    if err != nil {
        return nil, err
    }
    
    // Müraciəti yenilə
    app.RequestedAmount = &amount
    app.ProductCode = &productCode
    app.CheckTypeUsed = &checkType
    app.Status = "step2_completed"
    
    err = s.appRepo.Update(applicationID, app)
    if err != nil {
        return nil, err
    }
    
    return map[string]interface{}{
        "message":     "credit amount selected",
        "application_id": applicationID,
        "amount":      amount,
        "product_code": productCode,
        "check_type":  checkType,
        "status":      "step2_completed",
    }, nil
}
```

**Fayl**: `rdc/source/internal/handler/step2_handler.go`

```go
package handler

import (
    "encoding/json"
    "net/http"
    "rdc/internal/service"
    "strconv"
)

type Step2Handler struct {
    service *service.Step2Service
}

func NewStep2Handler(svc *service.Step2Service) *Step2Handler {
    return &Step2Handler{service: svc}
}

type selectAmountRequest struct {
    Amount      float64 `json:"amount"`
    ProductCode string  `json:"product_code"`
}

func (h *Step2Handler) SelectAmount(w http.ResponseWriter, r *http.Request) {
    // application_id URL-dən götürülür
    appIDStr := r.URL.Query().Get("application_id")
    if appIDStr == "" {
        writeError(w, http.StatusBadRequest, "application_id is required")
        return
    }
    appID, err := strconv.Atoi(appIDStr)
    if err != nil {
        writeError(w, http.StatusBadRequest, "invalid application_id")
        return
    }
    
    var req selectAmountRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        writeError(w, http.StatusBadRequest, "invalid request body")
        return
    }
    
    if req.Amount <= 0 {
        writeError(w, http.StatusBadRequest, "amount must be positive")
        return
    }
    
    result, err := h.service.SelectCreditAmount(appID, req.Amount, req.ProductCode)
    if err != nil {
        writeError(w, http.StatusBadRequest, err.Error())
        return
    }
    
    writeJSON(w, http.StatusOK, result)
}
```

---

## Faz E — Step 3: SIMA KYC + MyGov (Steps 18-21)

### Step 18: LW Provider Interface

**Fayl**: `rdc/source/pkg/lw/provider.go`

```go
package lw

import "context"

// Provider LW xidmətləri üçün interfeys
// 7+ xarici xidməti abstraktlaşdırır:
// - ASAN Imza (şəxsi məlumatlar)
// - AKB (credit bureau score & history)
// - SIMA (KYC)
// - MyGov (gəlir məlumatları)
// - Blacklist yoxlama
// - ASAN Finance (hesab blankı)
// - Credit scoring
type Provider interface {
    GetCustomerLoans(ctx context.Context, pin string) (*CustomerLoansResponse, error)
    SetupCustomerLoans(ctx context.Context, req *SetupLoansRequest) (*SetupLoansResponse, error)
    CheckBlacklist(ctx context.Context, pin string) (*BlacklistResponse, error)
    GetPersonalInfo(ctx context.Context, pin string, serial string) (*PersonalInfoResponse, error)
    GetAkbScore(ctx context.Context, pin string) (*AkbScoreResponse, error)
    GetAkbHistory(ctx context.Context, pin string) (*AkbHistoryResponse, error)
    GetAsanFinance(ctx context.Context, pin string) (*AsanFinanceResponse, error)
    InitSimaKyc(ctx context.Context, req *SimaKycRequest) (*SimaKycResponse, error)
    ApproveLoan(ctx context.Context, req *ApproveLoanRequest) (*ApproveLoanResponse, error)
}
```

---

### Step 19: LW Models

**Fayl**: `rdc/source/pkg/lw/model.go`

```go
package lw

// --- Customer Loans ---
type CustomerLoansResponse struct {
    Loans []CustomerLoan `json:"loans"`
}

type CustomerLoan struct {
    LoanID     string  `json:"loan_id"`
    Amount     float64 `json:"amount"`
    Balance    float64 `json:"balance"`
    Status     string  `json:"status"`
    BankName   string  `json:"bank_name"`
}

// --- Setup Loans ---
type SetupLoansRequest struct {
    PIN    string  `json:"pin"`
    Amount float64 `json:"amount"`
}

type SetupLoansResponse struct {
    Success      bool    `json:"success"`
    SetupID      string  `json:"setup_id"`
    MonthlyPayment float64 `json:"monthly_payment"`
}

// --- Blacklist ---
type BlacklistResponse struct {
    IsBlacklisted bool   `json:"is_blacklisted"`
    Reason       string `json:"reason,omitempty"`
}

// --- Personal Info ---
type PersonalInfoResponse struct {
    FullName  string `json:"full_name"`
    PIN       string `json:"pin"`
    BirthDate string `json:"birth_date"`
    Address   string `json:"address,omitempty"`
}

// --- AKB Score ---
type AkbScoreResponse struct {
    Score    int     `json:"score"`
    RiskLevel string `json:"risk_level"`
}

// --- AKB History ---
type AkbHistoryResponse struct {
    TotalLoans   int     `json:"total_loans"`
    ActiveLoans  int     `json:"active_loans"`
    OverdueCount int     `json:"overdue_count"`
    MaxDebt      float64 `json:"max_debt"`
}

// --- ASAN Finance ---
type AsanFinanceResponse struct {
    Accounts   []AsanAccount `json:"accounts"`
    TotalIncome float64     `json:"total_income"`
}

type AsanAccount struct {
    BankName   string  `json:"bank_name"`
    AccountNo  string  `json:"account_no"`
    Balance    float64 `json:"balance"`
    Income     float64 `json:"income"`
}

// --- SIMA KYC ---
type SimaKycRequest struct {
    PIN    string `json:"pin"`
    Serial string `json:"serial"`
    Phone  string `json:"phone"`
}

type SimaKycResponse struct {
    RequestID string `json:"request_id"`
    Status    string `json:"status"`
    Message   string `json:"message"`
}

// --- Approve Loan ---
type ApproveLoanRequest struct {
    ApplicationID int     `json:"application_id"`
    Amount        float64 `json:"amount"`
    ProductCode   string  `json:"product_code"`
    Score         int     `json:"score"`
    CheckType     string  `json:"check_type"`
}

type ApproveLoanResponse struct {
    Success   bool   `json:"success"`
    LoanID    string `json:"loan_id"`
    Message   string `json:"message"`
}
```

---

### Step 20: Mock LW Provider

**Fayl**: `rdc/source/pkg/lw/mock_provider.go`

```go
package lw

import "context"

type MockProvider struct{}

func NewMockProvider() *MockProvider {
    return &MockProvider{}
}

func (m *MockProvider) GetCustomerLoans(ctx context.Context, pin string) (*CustomerLoansResponse, error) {
    return &CustomerLoansResponse{
        Loans: []CustomerLoan{
            {LoanID: "L001", Amount: 5000, Balance: 2500, Status: "active", BankName: "Bank A"},
        },
    }, nil
}

func (m *MockProvider) SetupCustomerLoans(ctx context.Context, req *SetupLoansRequest) (*SetupLoansResponse, error) {
    return &SetupLoansResponse{
        Success:        true,
        SetupID:        "SETUP_MOCK_001",
        MonthlyPayment: req.Amount / 12,
    }, nil
}

func (m *MockProvider) CheckBlacklist(ctx context.Context, pin string) (*BlacklistResponse, error) {
    return &BlacklistResponse{IsBlacklisted: false}, nil
}

func (m *MockProvider) GetPersonalInfo(ctx context.Context, pin string, serial string) (*PersonalInfoResponse, error) {
    return &PersonalInfoResponse{
        FullName:  "Test User",
        PIN:       pin,
        BirthDate: "1990-01-01",
    }, nil
}

func (m *MockProvider) GetAkbScore(ctx context.Context, pin string) (*AkbScoreResponse, error) {
    return &AkbScoreResponse{Score: 650, RiskLevel: "medium"}, nil
}

func (m *MockProvider) GetAkbHistory(ctx context.Context, pin string) (*AkbHistoryResponse, error) {
    return &AkbHistoryResponse{
        TotalLoans:   2,
        ActiveLoans:  1,
        OverdueCount: 0,
        MaxDebt:      5000,
    }, nil
}

func (m *MockProvider) GetAsanFinance(ctx context.Context, pin string) (*AsanFinanceResponse, error) {
    return &AsanFinanceResponse{
        Accounts: []AsanAccount{
            {BankName: "Bank A", AccountNo: "****1234", Balance: 3000, Income: 1500},
        },
        TotalIncome: 1500,
    }, nil
}

func (m *MockProvider) InitSimaKyc(ctx context.Context, req *SimaKycRequest) (*SimaKycResponse, error) {
    return &SimaKycResponse{
        RequestID: "SIMA_MOCK_001",
        Status:    "pending",
        Message:   "SIMA KYC initiated",
    }, nil
}

func (m *MockProvider) ApproveLoan(ctx context.Context, req *ApproveLoanRequest) (*ApproveLoanResponse, error) {
    return &ApproveLoanResponse{
        Success: true,
        LoanID:  "LOAN_MOCK_001",
        Message: "Loan approved",
    }, nil
}
```

---

### Step 21: Step 3 Service + Handler (SIMA KYC + MyGov)

**Fayl**: `rdc/source/internal/service/step3_service.go`

```go
package service

import (
    "context"
    "fmt"
    "rdc/internal/model"
    "rdc/internal/repository"
    "rdc/pkg/lw"
)

type Step3Service struct {
    appRepo    *repository.ApplicationRepository
    custRepo   *repository.CustomerRepository
    lwProvider lw.Provider
}

func NewStep3Service(
    appRepo *repository.ApplicationRepository,
    custRepo *repository.CustomerRepository,
    lwProvider lw.Provider,
) *Step3Service {
    return &Step3Service{
        appRepo:    appRepo,
        custRepo:   custRepo,
        lwProvider: lwProvider,
    }
}

// InitSimaKyc — Step 3.1: SIMA KYC başlat
func (s *Step3Service) InitSimaKyc(applicationID int) (map[string]interface{}, error) {
    app, err := s.appRepo.FindByID(applicationID)
    if err != nil {
        return nil, err
    }
    if app == nil {
        return nil, fmt.Errorf("application not found")
    }
    if app.Status != "step2_completed" {
        return nil, fmt.Errorf("invalid status: expected step2_completed, got %s", app.Status)
    }
    
    // Müştəri məlumatlarını al
    customer, err := s.custRepo.FindByID(app.CustomerID)
    if err != nil || customer == nil {
        return nil, fmt.Errorf("customer not found")
    }
    
    // SIMA KYC başlat (LW provider vasitəsilə)
    simaResp, err := s.lwProvider.InitSimaKyc(context.Background(), &lw.SimaKycRequest{
        PIN:    customer.PIN,
        Serial: customer.Serial,
        Phone:  customer.Phone,
    })
    if err != nil {
        return nil, fmt.Errorf("SIMA KYC initiation failed: %w", err)
    }
    
    // Müraciəti yenilə
    requestID := simaResp.RequestID
    status := "sima_kyc_pending"
    app.SimaRequestID = &requestID
    app.SimaStatus = &simaResp.Status
    app.Status = status
    
    err = s.appRepo.Update(applicationID, app)
    if err != nil {
        return nil, err
    }
    
    return map[string]interface{}{
        "message":      "SIMA KYC initiated",
        "sima_request_id": requestID,
        "status":       status,
    }, nil
}

// CheckSimaStatus — Step 3.1: SIMA nəticəsini yoxla
func (s *Step3Service) CheckSimaStatus(applicationID int) (map[string]interface{}, error) {
    app, err := s.appRepo.FindByID(applicationID)
    if err != nil {
        return nil, err
    }
    if app == nil {
        return nil, fmt.Errorf("application not found")
    }
    
    // Mock: SIMA həmişə uğurlu olur
    simaStatus := "verified"
    app.SimaStatus = &simaStatus
    app.Status = "sima_verified"
    
    err = s.appRepo.Update(applicationID, app)
    if err != nil {
        return nil, err
    }
    
    return map[string]interface{}{
        "message":       "SIMA KYC verified",
        "sima_status":   simaStatus,
        "status":        "sima_verified",
    }, nil
}

// InitMyGov — Step 3.2: MyGov gəlir yoxlaması başlat
func (s *Step3Service) InitMyGov(applicationID int) (map[string]interface{}, error) {
    app, err := s.appRepo.FindByID(applicationID)
    if err != nil {
        return nil, err
    }
    if app == nil {
        return nil, fmt.Errorf("application not found")
    }
    if app.Status != "sima_verified" {
        return nil, fmt.Errorf("invalid status: expected sima_verified, got %s", app.Status)
    }
    
    // Müştəri məlumatlarını al
    customer, err := s.custRepo.FindByID(app.CustomerID)
    if err != nil || customer == nil {
        return nil, fmt.Errorf("customer not found")
    }
    
    // MyGov vasitəsilə gəlir məlumatları al (LW provider)
    asanResp, err := s.lwProvider.GetAsanFinance(context.Background(), customer.PIN)
    if err != nil {
        return nil, fmt.Errorf("MyGov/ASAN Finance check failed: %w", err)
    }
    
    // Müraciəti yenilə
    myGovStatus := "pending"
    requestID := "MYGOV_" + customer.PIN
    app.MyGovRequestID = &requestID
    app.MyGovStatus = &myGovStatus
    app.Status = "mygov_pending"
    
    err = s.appRepo.Update(applicationID, app)
    if err != nil {
        return nil, err
    }
    
    return map[string]interface{}{
        "message":          "MyGov income check initiated",
        "mygov_request_id": requestID,
        "status":           "mygov_pending",
    }, nil
}

// CheckMyGovStatus — Step 3.2: MyGov nəticəsini yoxla
func (s *Step3Service) CheckMyGovStatus(applicationID int) (map[string]interface{}, error) {
    app, err := s.appRepo.FindByID(applicationID)
    if err != nil {
        return nil, err
    }
    if app == nil {
        return nil, fmt.Errorf("application not found")
    }
    
    // Müştəri məlumatlarını al
    customer, err := s.custRepo.FindByID(app.CustomerID)
    if err != nil || customer == nil {
        return nil, fmt.Errorf("customer not found")
    }
    
    // LW-dən gəlir məlumatlarını al
    asanResp, err := s.lwProvider.GetAsanFinance(context.Background(), customer.PIN)
    if err != nil {
        return nil, err
    }
    
    // Gəlir məlumatlarını müraciətə yaz
    totalIncome := asanResp.TotalIncome
    var debtRatio float64 = 0.35 // placeholder
    if app.RequestedAmount != nil && totalIncome > 0 {
        debtRatio = float64(*app.RequestedAmount) / (totalIncome * 12)
    }
    
    myGovStatus := "verified"
    app.MyGovStatus = &myGovStatus
    app.MonthlyIncome = &totalIncome
    app.DebtRatio = &debtRatio
    app.Status = "mygov_verified"
    
    err = s.appRepo.Update(applicationID, app)
    if err != nil {
        return nil, err
    }
    
    return map[string]interface{}{
        "message":        "MyGov verified, income data received",
        "monthly_income": totalIncome,
        "debt_ratio":     debtRatio,
        "status":         "mygov_verified",
    }, nil
}
```

**Fayl**: `rdc/source/internal/handler/step3_handler.go`

```go
package handler

import (
    "net/http"
    "rdc/internal/service"
    "strconv"
)

type Step3Handler struct {
    service *service.Step3Service
}

func NewStep3Handler(svc *service.Step3Service) *Step3Handler {
    return &Step3Handler{service: svc}
}

func (h *Step3Handler) InitSimaKyc(w http.ResponseWriter, r *http.Request) {
    appID, err := strconv.Atoi(r.URL.Query().Get("application_id"))
    if err != nil {
        writeError(w, http.StatusBadRequest, "invalid application_id")
        return
    }
    
    result, err := h.service.InitSimaKyc(appID)
    if err != nil {
        writeError(w, http.StatusBadRequest, err.Error())
        return
    }
    writeJSON(w, http.StatusOK, result)
}

func (h *Step3Handler) CheckSimaStatus(w http.ResponseWriter, r *http.Request) {
    appID, err := strconv.Atoi(r.URL.Query().Get("application_id"))
    if err != nil {
        writeError(w, http.StatusBadRequest, "invalid application_id")
        return
    }
    
    result, err := h.service.CheckSimaStatus(appID)
    if err != nil {
        writeError(w, http.StatusBadRequest, err.Error())
        return
    }
    writeJSON(w, http.StatusOK, result)
}

func (h *Step3Handler) InitMyGov(w http.ResponseWriter, r *http.Request) {
    appID, err := strconv.Atoi(r.URL.Query().Get("application_id"))
    if err != nil {
        writeError(w, http.StatusBadRequest, "invalid application_id")
        return
    }
    
    result, err := h.service.InitMyGov(appID)
    if err != nil {
        writeError(w, http.StatusBadRequest, err.Error())
        return
    }
    writeJSON(w, http.StatusOK, result)
}

func (h *Step3Handler) CheckMyGovStatus(w http.ResponseWriter, r *http.Request) {
    appID, err := strconv.Atoi(r.URL.Query().Get("application_id"))
    if err != nil {
        writeError(w, http.StatusBadRequest, "invalid application_id")
        return
    }
    
    result, err := h.service.CheckMyGovStatus(appID)
    if err != nil {
        writeError(w, http.StatusBadRequest, err.Error())
        return
    }
    writeJSON(w, http.StatusOK, result)
}
```

---

## Faz F — Step 4: Income Verification + LW Approval (Steps 22-24)

### Step 22: Step 4 Service (Income Verification + LW)

**Fayl**: `rdc/source/internal/service/step4_service.go`

```go
package service

import (
    "context"
    "encoding/json"
    "fmt"
    "rdc/internal/model"
    "rdc/internal/repository"
    "rdc/pkg/lw"
)

type Step4Service struct {
    appRepo      *repository.ApplicationRepository
    custRepo     *repository.CustomerRepository
    lwProvider   lw.Provider
    creditEngine *CreditEngine
}

func NewStep4Service(
    appRepo *repository.ApplicationRepository,
    custRepo *repository.CustomerRepository,
    lwProvider lw.Provider,
    creditEngine *CreditEngine,
) *Step4Service {
    return &Step4Service{
        appRepo:      appRepo,
        custRepo:     custRepo,
        lwProvider:   lwProvider,
        creditEngine: creditEngine,
    }
}

// VerifyIncome — Step 4.1: Gəlir təsdiqi
func (s *Step4Service) VerifyIncome(applicationID int) (map[string]interface{}, error) {
    app, err := s.appRepo.FindByID(applicationID)
    if err != nil {
        return nil, err
    }
    if app == nil {
        return nil, fmt.Errorf("application not found")
    }
    if app.Status != "mygov_verified" {
        return nil, fmt.Errorf("invalid status: expected mygov_verified, got %s", app.Status)
    }
    
    // AKB Score al
    customer, err := s.custRepo.FindByID(app.CustomerID)
    if err != nil || customer == nil {
        return nil, fmt.Errorf("customer not found")
    }
    
    akbResp, err := s.lwProvider.GetAkbScore(context.Background(), customer.PIN)
    if err != nil {
        return nil, fmt.Errorf("AKB score fetch failed: %w", err)
    }
    
    // Gəlir məlumatları artıq MyGov step-ində yazılıb
    // Status update
    app.Status = "income_verified"
    err = s.appRepo.Update(applicationID, app)
    if err != nil {
        return nil, err
    }
    
    return map[string]interface{}{
        "message":     "income verified",
        "akb_score":   akbResp.Score,
        "risk_level":  akbResp.RiskLevel,
        "status":      "income_verified",
    }, nil
}

// RequestLWApproval — Step 4.2: LW təsdiqi
func (s *Step4Service) RequestLWApproval(applicationID int) (map[string]interface{}, error) {
    app, err := s.appRepo.FindByID(applicationID)
    if err != nil {
        return nil, err
    }
    if app == nil {
        return nil, fmt.Errorf("application not found")
    }
    if app.Status != "income_verified" {
        return nil, fmt.Errorf("invalid status: expected income_verified, got %s", app.Status)
    }
    
    // Customer məlumatları
    customer, err := s.custRepo.FindByID(app.CustomerID)
    if err != nil || customer == nil {
        return nil, fmt.Errorf("customer not found")
    }
    
    // Blacklist yoxlama
    blacklistResp, err := s.lwProvider.CheckBlacklist(context.Background(), customer.PIN)
    if err != nil {
        return nil, fmt.Errorf("blacklist check failed: %w", err)
    }
    if blacklistResp.IsBlacklisted {
        app.Status = "rejected"
        reason := "blacklisted"
        app.LWResponseData = &reason
        s.appRepo.Update(applicationID, app)
        return nil, fmt.Errorf("customer is blacklisted: %s", blacklistResp.Reason)
    }
    
    // Credit Engine scoring
    lwData := map[string]interface{}{
        "akb_score":     650, // placeholder, real-da LW-dən gəlir
        "credit_history": "good",
    }
    scoreResult := s.creditEngine.CalculateScore(app, lwData)
    
    score := scoreResult.Score
    app.CreditScore = &score
    
    // Status: lw_approve_pending
    requestID := fmt.Sprintf("LW_%d", applicationID)
    lwStatus := "pending"
    app.LWRequestID = &requestID
    app.LWStatus = &lwStatus
    app.Status = "lw_approve_pending"
    
    err = s.appRepo.Update(applicationID, app)
    if err != nil {
        return nil, err
    }
    
    return map[string]interface{}{
        "message":       "LW approval request submitted",
        "lw_request_id": requestID,
        "credit_score":  score,
        "check_type":    scoreResult.CheckType,
        "status":        "lw_approve_pending",
    }, nil
}

// CheckLWDecision — Step 4.3: LW qərarını yoxla
func (s *Step4Service) CheckLWDecision(applicationID int) (map[string]interface{}, error) {
    app, err := s.appRepo.FindByID(applicationID)
    if err != nil {
        return nil, err
    }
    if app == nil {
        return nil, fmt.Errorf("application not found")
    }
    if app.Status != "lw_approve_pending" {
        return nil, fmt.Errorf("invalid status: expected lw_approve_pending, got %s", app.Status)
    }
    
    customer, err := s.custRepo.FindByID(app.CustomerID)
    if err != nil || customer == nil {
        return nil, fmt.Errorf("customer not found")
    }
    
    // LW Approve (mock: həmişə approve)
    productCode := "RDC_CONSUMER"
    if app.ProductCode != nil {
        productCode = *app.ProductCode
    }
    score := 0
    if app.CreditScore != nil {
        score = *app.CreditScore
    }
    checkType := "SIMPLE"
    if app.CheckTypeUsed != nil {
        checkType = *app.CheckTypeUsed
    }
    
    approveResp, err := s.lwProvider.ApproveLoan(context.Background(), &lw.ApproveLoanRequest{
        ApplicationID: applicationID,
        Amount:        *app.RequestedAmount,
        ProductCode:   productCode,
        Score:         score,
        CheckType:     checkType,
    })
    if err != nil {
        return nil, fmt.Errorf("LW approval failed: %w", err)
    }
    
    // Nəticəni yaz
    if approveResp.Success {
        app.Status = "approved"
        lwStatus := "approved"
        app.LWStatus = &lwStatus
        respData, _ := json.Marshal(approveResp)
        respStr := string(respData)
        app.LWResponseData = &respStr
    } else {
        app.Status = "rejected"
        lwStatus := "rejected"
        app.LWStatus = &lwStatus
        app.LWResponseData = &approveResp.Message
    }
    
    err = s.appRepo.Update(applicationID, app)
    if err != nil {
        return nil, err
    }
    
    return map[string]interface{}{
        "message":    "LW decision received",
        "loan_id":    approveResp.LoanID,
        "status":     app.Status,
        "approved":   approveResp.Success,
    }, nil
}
```

---

### Step 23: Step 4 Handler

**Fayl**: `rdc/source/internal/handler/step4_handler.go`

```go
package handler

import (
    "net/http"
    "rdc/internal/service"
    "strconv"
)

type Step4Handler struct {
    service *service.Step4Service
}

func NewStep4Handler(svc *service.Step4Service) *Step4Handler {
    return &Step4Handler{service: svc}
}

func (h *Step4Handler) VerifyIncome(w http.ResponseWriter, r *http.Request) {
    appID, err := strconv.Atoi(r.URL.Query().Get("application_id"))
    if err != nil {
        writeError(w, http.StatusBadRequest, "invalid application_id")
        return
    }
    
    result, err := h.service.VerifyIncome(appID)
    if err != nil {
        writeError(w, http.StatusBadRequest, err.Error())
        return
    }
    writeJSON(w, http.StatusOK, result)
}

func (h *Step4Handler) RequestLWApproval(w http.ResponseWriter, r *http.Request) {
    appID, err := strconv.Atoi(r.URL.Query().Get("application_id"))
    if err != nil {
        writeError(w, http.StatusBadRequest, "invalid application_id")
        return
    }
    
    result, err := h.service.RequestLWApproval(appID)
    if err != nil {
        writeError(w, http.StatusBadRequest, err.Error())
        return
    }
    writeJSON(w, http.StatusOK, result)
}

func (h *Step4Handler) CheckLWDecision(w http.ResponseWriter, r *http.Request) {
    appID, err := strconv.Atoi(r.URL.Query().Get("application_id"))
    if err != nil {
        writeError(w, http.StatusBadRequest, "invalid application_id")
        return
    }
    
    result, err := h.service.CheckLWDecision(appID)
    if err != nil {
        writeError(w, http.StatusBadRequest, err.Error())
        return
    }
    writeJSON(w, http.StatusOK, result)
}
```

---

### Step 24: Application Status Handler

**Fayl**: `rdc/source/internal/handler/status_handler.go`

```go
package handler

import (
    "net/http"
    "rdc/internal/repository"
    "strconv"
)

type StatusHandler struct {
    appRepo *repository.ApplicationRepository
}

func NewStatusHandler(appRepo *repository.ApplicationRepository) *StatusHandler {
    return &StatusHandler{appRepo: appRepo}
}

func (h *StatusHandler) GetApplicationStatus(w http.ResponseWriter, r *http.Request) {
    appID, err := strconv.Atoi(r.URL.Query().Get("application_id"))
    if err != nil {
        writeError(w, http.StatusBadRequest, "invalid application_id")
        return
    }
    
    app, err := h.appRepo.FindByID(appID)
    if err != nil {
        writeError(w, http.StatusInternalServerError, "database error")
        return
    }
    if app == nil {
        writeError(w, http.StatusNotFound, "application not found")
        return
    }
    
    writeJSON(w, http.StatusOK, app)
}
```

---

## Faz G — Postman Collection (Steps 25-26)

### Step 25: Postman Collection JSON

**Fayl**: `rdc/source/postman/rdc_collection.json`

```json
{
  "info": {
    "name": "RDC Credit Laddering API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    { "key": "base_url", "value": "http://localhost:8080" },
    { "key": "application_id", "value": "" }
  ],
  "item": [
    {
      "name": "Step 1.1 — Request OTP",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/v1/applications/request-otp",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"phone\": \"+994501234567\",\n  \"full_name\": \"Zamir Jamalov\",\n  \"pin\": \"ABCDE12345\",\n  \"serial\": \"AZ\",\n  \"birth_date\": \"1990-01-15\"\n}"
        }
      }
    },
    {
      "name": "Step 1.2 — Verify OTP",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/v1/applications/verify-otp",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"phone\": \"+994501234567\",\n  \"code\": \"123456\"\n}"
        }
      }
    },
    {
      "name": "Step 2 — Select Credit Amount",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/v1/applications/step2/select-amount?application_id={{application_id}}",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"amount\": 5000,\n  \"product_code\": \"RDC_CONSUMER\"\n}"
        }
      }
    },
    {
      "name": "Step 3.1 — Init SIMA KYC",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/v1/applications/step3/sima-init?application_id={{application_id}}"
      }
    },
    {
      "name": "Step 3.1 — Check SIMA Status",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/v1/applications/step3/sima-status?application_id={{application_id}}"
      }
    },
    {
      "name": "Step 3.2 — Init MyGov",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/v1/applications/step3/mygov-init?application_id={{application_id}}"
      }
    },
    {
      "name": "Step 3.2 — Check MyGov Status",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/v1/applications/step3/mygov-status?application_id={{application_id}}"
      }
    },
    {
      "name": "Step 4.1 — Verify Income",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/v1/applications/step4/verify-income?application_id={{application_id}}"
      }
    },
    {
      "name": "Step 4.2 — Request LW Approval",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/v1/applications/step4/lw-approve?application_id={{application_id}}"
      }
    },
    {
      "name": "Step 4.3 — Check LW Decision",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/v1/applications/step4/lw-decision?application_id={{application_id}}"
      }
    },
    {
      "name": "Get Application Status",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/v1/applications/status?application_id={{application_id}}"
      }
    }
  ]
}
```

---

## Faz H — Main App + Wiring (Steps 27-28)

### Step 27: main.go — Application Entry Point

**Fayl**: `rdc/source/main.go`

```go
package main

import (
    "database/sql"
    "fmt"
    "log"
    "net/http"
    
    _ "github.com/denisenkom/go-mssqldb"
    
    "rdc/config"
    "rdc/internal/handler"
    "rdc/internal/repository"
    "rdc/internal/service"
    "rdc/pkg/lw"
    "rdc/pkg/otp"
    "rdc/pkg/sms"
)

func main() {
    // Config yüklə
    cfg := config.Load()
    
    // Database bağlantısı
    connStr := fmt.Sprintf(
        "server=%s;port=%s;user id=%s;password=%s;database=%s;encrypt=disable",
        cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName,
    )
    db, err := sql.Open("sqlserver", connStr)
    if err != nil {
        log.Fatalf("DB connection failed: %v", err)
    }
    defer db.Close()
    
    if err := db.Ping(); err != nil {
        log.Fatalf("DB ping failed: %v", err)
    }
    log.Println("Connected to SQL Server")
    
    // SMS Provider
    smsProvider := sms.NewProvider(cfg)
    
    // OTP Provider (SMS-ə bağlıdır!)
    otpProvider := otp.NewProvider(db, smsProvider, cfg)
    
    // LW Provider
    var lwProvider lw.Provider = lw.NewMockProvider()
    
    // Repositories
    customerRepo := repository.NewCustomerRepository(db)
    applicationRepo := repository.NewApplicationRepository(db)
    
    // Credit Engine
    creditEngine := service.NewCreditEngine(db)
    
    // Services
    appService := service.NewApplicationService(customerRepo, applicationRepo, otpProvider)
    step2Service := service.NewStep2Service(applicationRepo, creditEngine)
    step3Service := service.NewStep3Service(applicationRepo, customerRepo, lwProvider)
    step4Service := service.NewStep4Service(applicationRepo, customerRepo, lwProvider, creditEngine)
    
    // Handlers
    appHandler := handler.NewApplicationHandler(appService)
    step2Handler := handler.NewStep2Handler(step2Service)
    step3Handler := handler.NewStep3Handler(step3Service)
    step4Handler := handler.NewStep4Handler(step4Service)
    statusHandler := handler.NewStatusHandler(applicationRepo)
    
    // Routes
    mux := http.NewServeMux()
    
    // Step 1: OTP
    mux.HandleFunc("/api/v1/applications/request-otp", appHandler.RequestOTP)
    mux.HandleFunc("/api/v1/applications/verify-otp", appHandler.VerifyOTP)
    
    // Step 2: Credit Amount
    mux.HandleFunc("/api/v1/applications/step2/select-amount", step2Handler.SelectAmount)
    
    // Step 3: SIMA + MyGov
    mux.HandleFunc("/api/v1/applications/step3/sima-init", step3Handler.InitSimaKyc)
    mux.HandleFunc("/api/v1/applications/step3/sima-status", step3Handler.CheckSimaStatus)
    mux.HandleFunc("/api/v1/applications/step3/mygov-init", step3Handler.InitMyGov)
    mux.HandleFunc("/api/v1/applications/step3/mygov-status", step3Handler.CheckMyGovStatus)
    
    // Step 4: Income + LW
    mux.HandleFunc("/api/v1/applications/step4/verify-income", step4Handler.VerifyIncome)
    mux.HandleFunc("/api/v1/applications/step4/lw-approve", step4Handler.RequestLWApproval)
    mux.HandleFunc("/api/v1/applications/step4/lw-decision", step4Handler.CheckLWDecision)
    
    // Status
    mux.HandleFunc("/api/v1/applications/status", statusHandler.GetApplicationStatus)
    
    // Health check
    mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        w.Write([]byte(`{"status":"ok"}`))
    })
    
    addr := ":8080"
    log.Printf("RDC Server starting on %s", addr)
    if err := http.ListenAndServe(addr, mux); err != nil {
        log.Fatalf("Server failed: %v", err)
    }
}
```

---

### Step 28: Migration Runner

**Fayl**: `rdc/source/cmd/migrate/main.go`

```go
package main

import (
    "database/sql"
    "fmt"
    "log"
    "os"
    
    _ "github.com/denisenkom/go-mssqldb"
    "rdc/config"
)

func main() {
    cfg := config.Load()
    
    connStr := fmt.Sprintf(
        "server=%s;port=%s;user id=%s;password=%s;database=%s;encrypt=disable",
        cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName,
    )
    db, err := sql.Open("sqlserver", connStr)
    if err != nil {
        log.Fatalf("DB connection failed: %v", err)
    }
    defer db.Close()
    
    // Migration faylını oxu
    migrationPath := "migrations/001_init.sql"
    sqlContent, err := os.ReadFile(migrationPath)
    if err != nil {
        log.Fatalf("Migration file read failed: %v", err)
    }
    
    // İcrа et
    _, err = db.Exec(string(sqlContent))
    if err != nil {
        log.Fatalf("Migration execution failed: %v", err)
    }
    
    log.Println("Migration 001_init.sql executed successfully")
}
```

---

## File Structure

```
rdc/source/
├── go.mod
├── go.sum
├── main.go
├── cmd/
│   └── migrate/
│       └── main.go
├── config/
│   └── config.go
├── migrations/
│   └── 001_init.sql
├── pkg/
│   ├── sms/
│   │   ├── provider.go          # SMS Provider interface
│   │   ├── softline.go          # Softline HTTP implementation
│   │   ├── mock_provider.go     # Mock SMS
│   │   └── factory.go           # SMS provider factory
│   ├── otp/
│   │   ├── provider.go          # OTP Provider interface
│   │   ├── db_provider.go       # DB-based OTP + SMS
│   │   ├── mock_provider.go     # Mock OTP (123456)
│   │   └── factory.go           # OTP provider factory
│   └── lw/
│       ├── provider.go          # LW Provider interface (9 methods)
│       ├── model.go             # LW request/response models
│       └── mock_provider.go     # Mock LW provider
├── internal/
│   ├── model/
│   │   └── models.go            # Customer, LoanApplication models
│   ├── repository/
│   │   ├── customer_repo.go     # Customer CRUD
│   │   └── application_repo.go  # Application CRUD + status updates
│   ├── service/
│   │   ├── application_service.go  # Step 1: OTP flow
│   │   ├── step2_service.go        # Step 2: Credit amount
│   │   ├── credit_engine_check.go  # Check type determination
│   │   ├── credit_engine_score.go  # Scoring logic
│   │   ├── step3_service.go        # Step 3: SIMA KYC + MyGov
│   │   └── step4_service.go        # Step 4: Income + LW approval
│   └── handler/
│       ├── application_handler.go   # Step 1 endpoints
│       ├── step2_handler.go         # Step 2 endpoints
│       ├── step3_handler.go         # Step 3 endpoints
│       ├── step4_handler.go         # Step 4 endpoints
│       └── status_handler.go        # Status endpoint
└── postman/
    └── rdc_collection.json       # Postman collection
```

---

## API Endpoints Summary

| Method | Endpoint | Step | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/applications/request-otp` | 1.1 | OTP göndər (müştəri yarat/yoxla) |
| POST | `/api/v1/applications/verify-otp` | 1.2 | OTP təsdiqlə, müraciət yarad |
| POST | `/api/v1/applications/step2/select-amount` | 2 | Məbləğ seç, check_type müəyyən et |
| POST | `/api/v1/applications/step3/sima-init` | 3.1 | SIMA KYC başlat |
| GET | `/api/v1/applications/step3/sima-status` | 3.1 | SIMA nəticəsini yoxla |
| POST | `/api/v1/applications/step3/mygov-init` | 3.2 | MyGov gəlir yoxlaması başlat |
| GET | `/api/v1/applications/step3/mygov-status` | 3.2 | MyGov nəticəsini yoxla |
| POST | `/api/v1/applications/step4/verify-income` | 4.1 | Gəliri təsdiqlə (AKB score al) |
| POST | `/api/v1/applications/step4/lw-approve` | 4.2 | LW təsdiqi üçün müraciət |
| GET | `/api/v1/applications/step4/lw-decision` | 4.3 | LW qərarını yoxla |
| GET | `/api/v1/applications/status` | — | Müraciət statusunu yoxla |
| GET | `/health` | — | Server health check |

---

## Environment Variables (.env)

```env
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=MySecretPassword123!
DB_NAME=rdc

SMS_PROVIDER=softline
SOFTLINE_USER=softlinetestapi
SOFTLINE_PASS=ZXe5Gk1G
SOFTLINE_URL=http://gw.softline.az/sendsms

LW_PROVIDER=mock

OTP_LENGTH=6
OTP_EXPIRY_SEC=120
```

---

## Softline SMS Gateway Reference

**Endpoint**: `GET http://gw.softline.az/sendsms`

**Parametrlər**:
| Parametr | Nümunə | İzah |
|----------|--------|------|
| user | softlinetestapi | API istifadəçisi |
| password | ZXe5Gk1G | API şifrə |
| gsm | 994501234567 | Telefon nömrəsi (ölkə kodu ilə, + olmadan) |
| from | SOFTLINE | Göndərən adı |
| text | Sizin kod 123456 | Mesaj mətni |

**Response format**: `errno=100&errtext=OK&message_id=526973&charge=1&balance=123`

**Error codes**:
| errno | Mənası |
|-------|--------|
| 100 | Uğurlu |
| 0 | Parametr çatışmır |
| 20 | Yalnış MSISDN formatı |
| 25 | Nömrə blacklist-də |
| 40 | Yanlış istifadəçi adı/şifrə |
| 60 | Balans kifayət deyil |
| 200 | Server xətası |

---

## Implementation Order (Faz A → H)

| Faz | Steps | Mövzu | Fayl sayı |
|-----|-------|-------|-----------|
| **A** | 1-5 | Project structure + SMS Provider | 5 |
| **B** | 6-9 | OTP Provider | 4 |
| **C** | 10-14 | Models + Repos + Step 1 (OTP flow) | 6 |
| **D** | 15-17 | Step 2 + Credit Engine (check + score) | 3 |
| **E** | 18-21 | LW Provider + Step 3 (SIMA + MyGov) | 5 |
| **F** | 22-24 | Step 4 (Income + LW Approval) + Status | 3 |
| **G** | 25-26 | Postman Collection | 1 |
| **H** | 27-28 | main.go + Migration Runner | 2 |
| | | **Cəmi** | **29 fayl** |

---

## Known Gaps & Fixes (Ç-1 → Ç-7)

| Gap | Problem | Fix |
|-----|---------|-----|
| **Ç-1** | Customers table normalization | `full_name`, `pin`, `serial`, `birth_date` customers-da saxlanılır |
| **Ç-2** | HasPendingApplication səhv logikası | `NOT IN ('approved', 'rejected')` ilə düzəldildi |
| **Ç-3** | Migration runner DB adı | Config-dən DB_NAME oxunur |
| **Ç-4** | Credit Engine 3 fayla split | `credit_engine_check.go` + `credit_engine_score.go` |
| **Ç-5** | SERIAL parametr adı | Hamıda `serial` (SERIA yox) |
| **Ç-6** | Mock SMS `time` import | `mock_provider.go`-da `time` package daxil edilib |
| **Ç-7** | app.go SMS dependency | `otp.NewProvider(db, smsProvider, cfg)` — SMS provider keçilir |