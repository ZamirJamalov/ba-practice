import csv
import random
from datetime import datetime, timedelta
import os

random.seed(42)  # Reproducible results

# =============================================================================
# 1. REAL DÜNYA BAZA MƏLUMAT HOVUZLARI
# =============================================================================

# Brand × Kateqoriya uyğunluğu (realistik: Sony monitor yoxdur, Nike qulaqlıq yoxdur)
CATEGORY_BRANDS = {
    "Electronics":    ["Sony", "Samsung", "LG", "Bose", "JBL", "Panasonic", "Toshiba"],
    "Computers":      ["Dell", "HP", "Lenovo", "Apple", "ASUS", "Acer", "Microsoft"],
    "Smart Home":     ["Amazon Basics", "TP-Link", "Wyze", "Ring", "Google Nest", "Philips Hue", "Belkin"],
    "Home & Kitchen": ["Breville", "KitchenAid", "Cuisinart", "Ninja", "Instant Pot", "Dyson", "Bosch"],
    "Sports & Outdoors": ["Nike", "Adidas", "Under Armour", "Columbia", "The North Face", "Yeti", "CamelBak"],
    "Books":          ["Penguin", "HarperCollins", "O'Reilly", "Wiley", "McGraw-Hill", "Simon & Schuster", "Random House"]
}

CATEGORY_NOUNS = {
    "Electronics":    ["Wireless Headphones", "Bluetooth Speaker", "4K TV", "Soundbar", "Earbuds",
                       "Portable Charger", "Action Camera", "Streaming Device", "LED Strip Lights", "Microphone"],
    "Computers":      ["Laptop", "Monitor", "Mechanical Keyboard", "Wireless Mouse", "Webcam",
                       "USB Hub", "SSD Drive", "Graphics Card", "RAM Module", "Docking Station"],
    "Smart Home":     ["Smart Plug", "Smart Bulb", "Video Doorbell", "Thermostat", "Security Camera",
                       "Robot Vacuum", "Air Purifier", "Smart Lock", "Smoke Detector", "Smart Display"],
    "Home & Kitchen": ["Coffee Maker", "Blender", "Air Fryer", "Stand Mixer", "Toaster Oven",
                       "Electric Kettle", "Food Processor", "Slow Cooker", "Vacuum Cleaner", "Iron"],
    "Sports & Outdoors": ["Running Shoes", "Yoga Mat", "Water Bottle", "Gym Bag", "Fitness Tracker",
                          "Resistance Bands", "Hiking Backpack", "Camping Tent", "Sunglasses", "Duffel Bag"],
    "Books":          ["Python Programming Guide", "Data Science Handbook", "Machine Learning Basics",
                       "Project Management", "Financial Independence", "Cooking Recipes",
                       "Self-Help Bestseller", "History Encyclopedia", "Sci-Fi Novel", "Business Strategy"]
}

# Kateqoriyaya görə qiymət aralığı (əsl dünya: kitab $8, laptop $400)
CATEGORY_PRICE_RANGE = {
    "Electronics":    (19.99, 499.99),
    "Computers":      (29.99, 1899.99),
    "Smart Home":     (14.99, 299.99),
    "Home & Kitchen": (24.99, 599.99),
    "Sports & Outdoors": (15.99, 249.99),
    "Books":          (7.99, 45.99)
}

# Kateqoriyaya görə fiziki xüsusiyyətlər
CATEGORY_PHYSICAL = {
    "Electronics":    {"weight": (0.15, 8.0),   "dim": ((15, 40), (10, 25), (3, 12))},
    "Computers":      {"weight": (0.5, 15.0),   "dim": ((30, 55), (20, 45), (5, 25))},
    "Smart Home":     {"weight": (0.1, 4.0),    "dim": ((8, 25),  (8, 20),  (5, 18))},
    "Home & Kitchen": {"weight": (1.0, 12.0),   "dim": ((15, 45), (15, 35), (10, 35))},
    "Sports & Outdoors": {"weight": (0.2, 8.0), "dim": ((20, 50), (10, 30), (5, 25))},
    "Books":          {"weight": (0.15, 1.8),   "dim": ((12, 25), (3, 20),  (1, 5))}
}

# Kateqoriyaya görə rəqabət dərəcəsi (qiymət fərqi %)
CATEGORY_PRICE_VARIANCE = {
    "Electronics":    0.08,
    "Computers":      0.06,
    "Smart Home":     0.04,
    "Home & Kitchen": 0.07,
    "Sports & Outdoors": 0.09,
    "Books":          0.15
}

TRAFFIC_SOURCES = ["Google Search", "TikTok Ad", "Amazon Internal Search", "Direct Link", "Instagram Influencer", "YouTube Review"]
CARRIERS = ["Amazon Logistics", "UPS", "FedEx", "DHL", "USPS"]
STATUS_OPTIONS = ["Delivered", "Shipped", "Processing", "Cancelled", "Returned"]
RETURN_REASONS = ["Defective", "Wrong Item Shipped", "Changed Mind", "Not as Described", "Better Price Found", "Arrived Too Late"]
PROMOTION_TYPES = ["None", "Lightning Deal", "Coupon", "Subscribe & Save", "Prime Exclusive Discount", "Buy X Get Y"]

STATES = ["CA", "TX", "FL", "NY", "PA", "IL", "OH", "GA", "NC", "MI",
          "WA", "AZ", "MA", "TN", "IN", "MO", "MD", "CO", "MN", "OR",
          "SC", "NV", "VA", "WI", "AL", "LA", "KY", "OK", "CT", "UT"]

WAREHOUSE_REGIONS = {
    "West":  ["FC-LAX-1", "FC-LAX-2", "FC-SFO-1", "FC-SEA-1", "FC-PHX-1"],
    "Central": ["FC-DFW-1", "FC-DFW-2", "FC-DFW-3", "FC-ORD-1", "FC-MSP-1"],
    "East":  ["FC-EWR-1", "FC-EWR-2", "FC-ATL-1", "FC-MIA-1", "FC-IAD-1"]
}

STATE_TO_REGION = {
    "CA": "West", "WA": "West", "OR": "West", "AZ": "West", "NV": "West", "CO": "Central",
    "TX": "Central", "FL": "East", "NY": "East", "PA": "East", "IL": "Central",
    "OH": "East", "GA": "East", "NC": "East", "MI": "Central", "MA": "East",
    "TN": "Central", "IN": "Central", "MO": "Central", "MD": "East", "MN": "Central",
    "SC": "East", "VA": "East", "WI": "Central", "AL": "East", "LA": "Central",
    "KY": "East", "OK": "Central", "CT": "East", "UT": "West"
}

PAYMENT_METHODS = ["Credit Card", "Amazon Pay", "PayPal", "Gift Card", "Debit Card", "Venmo"]

US_HOLIDAYS_2025 = [
    datetime(2025, 1, 1),   datetime(2025, 1, 20), datetime(2025, 2, 17),
    datetime(2025, 5, 26), datetime(2025, 7, 4),  datetime(2025, 9, 1),
    datetime(2025, 10, 13), datetime(2025, 11, 11), datetime(2025, 11, 27),
    datetime(2025, 12, 25)
]

TOTAL_ROWS = 1_000_000
NUM_CUSTOMERS = 200_000
PRODUCT_COUNT = 10_000
FILENAME = "amazon_perfect_analytics_1m.csv"

# =============================================================================
# 2. MƏHSUL KATALOQUNUN YARADILMASI (Brand × Kateqoriya uyğun)
# =============================================================================

print(f"[1/4] {PRODUCT_COUNT:,} unikal məhsul kataloqu yaradılır (Brand × Kateqoriya uyğunluğu ilə)...")

product_catalog = []
categories = list(CATEGORY_BRANDS.keys())

for i in range(PRODUCT_COUNT):
    cat = random.choices(categories, weights=[22, 18, 14, 16, 15, 15], k=1)[0]
    brand = random.choice(CATEGORY_BRANDS[cat])
    noun = random.choice(CATEGORY_NOUNS[cat])
    prod_name = f"{brand} {noun} X-{random.randint(100, 999)}"

    price_lo, price_hi = CATEGORY_PRICE_RANGE[cat]
    unit_price = round(random.uniform(price_lo, price_hi), 2)
    cogs = round(unit_price * random.uniform(0.55, 0.75), 2)
    asin = f"B0{random.randint(1000000, 9999999)}"

    # Reytinqlər: 75% yaxşı (4.0-5.0), 25% orta (3.0-3.9)
    if random.random() > 0.25:
        rating = round(random.uniform(4.0, 5.0), 1)
        popularity_weight = random.randint(4, 6)
    else:
        rating = round(random.uniform(3.0, 3.9), 1)
        popularity_weight = random.randint(1, 2)

    reviews = random.randint(50, 28000) if rating >= 4.0 else random.randint(5, 500)

    price_variance = CATEGORY_PRICE_VARIANCE[cat]

    product_catalog.append({
        "name": prod_name, "cat": cat, "price": unit_price, "cogs": cogs,
        "asin": asin, "rating": rating, "reviews": reviews,
        "weight": popularity_weight, "price_var": price_variance
    })

catalog_weights = [p["weight"] for p in product_catalog]

# =============================================================================
# 3. MÜŞTƏRİ BAZASININ YARADILMASI (Qayıtan müştəri modeli)
# =============================================================================

print(f"[2/4] {NUM_CUSTOMERS:,} unikal müştəri profili yaradılır (qayıtan alış-veriş modeli ilə)...")

customers = []
for i in range(NUM_CUSTOMERS):
    cust_id = f"CUST-{100000 + i}"
    is_prime = random.choices([True, False], weights=[62, 38], k=1)[0]

    # 80% aktiv müştəri, 20% az aktiv
    if random.random() > 0.2:
        order_count = random.choices(
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20],
            weights=[15, 18, 16, 12, 10, 8, 6, 5, 3, 3, 2, 2], k=1
        )[0]
    else:
        order_count = 1

    preferred_device = random.choices(
        ["Mobile_App", "Desktop", "Mobile_Web"], weights=[55, 30, 15], k=1
    )[0]

    # Müştəri yaratılma tarixi (2022-2024 arası qeydiyyat)
    join_year = random.choices([2022, 2023, 2024, 2025], weights=[10, 25, 35, 30], k=1)[0]
    join_month = random.randint(1, 12)
    join_date = datetime(join_year, min(join_month, 12), random.randint(1, 28))

    state = random.choice(STATES)
    region = STATE_TO_REGION.get(state, "Central")

    customers.append({
        "id": cust_id, "is_prime": is_prime, "order_count": order_count,
        "device": preferred_device, "join_date": join_date,
        "state": state, "region": region,
        "total_spent": 0.0, "order_history": [], "lifetime_value": 0.0
    })

# =============================================================================
# 4. TARİX & MÖVSÜMLÜLÜK MODELİ
# =============================================================================

def generate_realistic_order_date():
    """Real dünya mövsümlülüyü: saat, gün, həftə, bayram, Prime Day, Black Friday nəzərə alınır."""

    # Ayların bazası: Noyabr/Dekabr pik, Yanvar fevral azalır
    month_pool = [1, 2, 2, 3, 4, 5, 6, 7, 7, 7, 8, 9, 10, 11, 11, 11, 11, 12, 12, 12, 12, 12]
    month = random.choice(month_pool)

    # Həftənin günləri (əsasən Şənbə/Bazar daha çox alış-veriş)
    day_weights = [8, 9, 10, 11, 12, 18, 20]  # Bazar ertəsi=8 ... Şənbə=20
    day_of_week = random.choices(range(7), weights=day_weights, k=1)[0]

    # Gün tapmaq üçün: ayın 1-ci gününün həftə içi index-i
    first_of_month = datetime(2025, month, 1)
    first_dow = first_of_month.weekday()  # 0=Bazar ertəsi
    target_dow = day_of_week

    # Hədəf gününü hesabla
    day_offset = (target_dow - first_dow) % 7
    candidate = first_of_month + timedelta(days=day_offset)

    # Bir neçə həftə arasından seç
    max_weeks = 4 if month in [1, 2, 4, 6, 9, 11] else 5
    week_num = random.randint(0, min(max_weeks - 1, 3))
    candidate += timedelta(weeks=week_num)

    if candidate.month != month or candidate.day > 28:
        candidate = datetime(2025, month, random.randint(1, 28))

    # --- XÜSUSİ HADİSƏLƏR ---

    # Prime Day (İyul 15-16): 35% ehtimalla bu günlərə düşsün
    if month == 7 and random.random() < 0.35:
        candidate = datetime(2025, 7, random.choice([15, 16]))

    # Black Friday (Noyabr 4-cü cümə axşamı = 28 noyabr) və Cyber Monday
    if month == 11 and random.random() < 0.40:
        candidate = datetime(2025, 11, random.choice([27, 28, 29, 30, 1 if False else 28]))

    # Qələbə günündən sonra (15 Dekabr) sifarişlər azalır
    if month == 12 and candidate.day > 15:
        if random.random() < 0.5:
            candidate = datetime(2025, 12, random.randint(1, 15))

    # Saat distribusiyu (axşam 18:00-22:00 pik)
    hour_weights = [1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 18, 14, 8]
    hour = random.choices(range(24), weights=hour_weights, k=1)[0]
    minute = random.randint(0, 59)

    candidate = candidate.replace(hour=hour, minute=minute)
    return candidate


def is_holiday_or_weekend(dt):
    """Bayram və ya bazar günü olub-olmamasını yoxlayır."""
    if dt.weekday() >= 5:
        return True
    for h in US_HOLIDAYS_2025:
        if dt.date() == h.date():
            return True
    return False


# =============================================================================
# 5. MÜŞTƏRİ SİFARİŞ LƏRVƏZİ (hər müştəriyə məxsus sifarişlər)
# =============================================================================

print("[3/4] 1,000,000 sifariş real dünya asılılıqları ilə yaradılır...")

# Müştəri seçimini: çox sifarişi olan müştərilər daha çox çıxmalıdır
customer_weights = [c["order_count"] for c in customers]

all_rows = []
order_counter = 0

for row_idx in range(TOTAL_ROWS):
    # Müştəri seç (ağırlıqlı: çox sifarişi olanlar daha tez-tez)
    cust = random.choices(customers, weights=customer_weights, k=1)[0]

    # Müştəri məlumatları
    cust_id = cust["id"]
    is_prime = cust["is_prime"]
    device = cust["device"]
    state = cust["state"]
    cust_region = cust["region"]

    # 60% ehtimal: öz cihazını istifadə edir, 40% fərqli cihaz
    if random.random() < 0.6:
        final_device = device
    else:
        final_device = random.choice(["Mobile_App", "Desktop", "Mobile_Web"])

    session_id = f"SESS-{random.randint(10000000, 99999999)}"

    # --- MƏHSUL SEÇİMİ ---
    prod = random.choices(product_catalog, weights=catalog_weights, k=1)[0]
    cat = prod["cat"]
    price = prod["price"]
    cogs = prod["cogs"]
    asin = prod["asin"]
    prod_name = prod["name"]
    rating = prod["rating"]
    reviews = prod["reviews"]
    price_var = prod["price_var"]

    # --- TARİX ---
    o_date = generate_realistic_order_date()

    # Qeydiyyatdan əvvəl sifariş yoxdur
    if o_date < cust["join_date"]:
        o_date = cust["join_date"] + timedelta(days=random.randint(0, 30))

    # --- MARKETİNQ ---
    traffic = random.choices(TRAFFIC_SOURCES, weights=[28, 12, 30, 15, 10, 5], k=1)[0]
    if traffic in ["Amazon Internal Search", "Google Search"]:
        keyword_parts = prod_name.lower().split()
        keyword = random.choice(["buy", "best", "cheap", "review"]) + " " + random.choice(keyword_parts)
    else:
        keyword = ""

    ad_campaign = ""
    if traffic in ["TikTok Ad", "Instagram Influencer", "YouTube Review"]:
        ad_campaign = f"CAMP-{random.randint(1000, 9999)}"
    else:
        ad_campaign = ""

    # --- KƏMİYYƏT & ÖDƏNİŞ (qiymətdən asılı) ---
    if price > 500:
        qty = random.choices([1, 2], weights=[95, 5], k=1)[0]
        payment = random.choices(["Credit Card", "Amazon Pay", "Debit Card"], weights=[70, 20, 10], k=1)[0]
    elif price > 100:
        qty = random.choices([1, 2, 3], weights=[82, 14, 4], k=1)[0]
        payment = random.choices(PAYMENT_METHODS, weights=[40, 25, 15, 8, 8, 4], k=1)[0]
    else:
        qty = random.choices([1, 2, 3, 4, 5], weights=[55, 22, 12, 7, 4], k=1)[0]
        payment = random.choices(PAYMENT_METHODS, weights=[35, 25, 15, 12, 8, 5], k=1)[0]

    # --- ENDİRİM & PROMOSİYA ---
    promo_type = random.choices(
        PROMOTION_TYPES,
        weights=[55, 8, 12, 10, 8, 7], k=1
    )[0]

    if promo_type == "Lightning Deal":
        discount_pct = random.choice([0.15, 0.20, 0.25, 0.30])
    elif promo_type == "Coupon":
        discount_pct = random.choice([0.05, 0.10, 0.15])
    elif promo_type == "Subscribe & Save":
        discount_pct = random.choice([0.05, 0.10, 0.15])
    elif promo_type == "Prime Exclusive Discount":
        discount_pct = random.choice([0.08, 0.12]) if is_prime else 0
    elif promo_type == "Buy X Get Y":
        discount_pct = 0.10
    else:
        discount_pct = random.choices([0, 0.02, 0.03], weights=[85, 10, 5], k=1)[0]

    discount = round(price * discount_pct, 2)

    # --- MALİYYƏ HESABLAMALARI ---
    base_total = (price - discount) * qty
    tax = round(base_total * 0.08, 2)
    shipping_fee = 0.00 if is_prime else round(random.choices([4.99, 5.99, 7.99], weights=[60, 30, 10], k=1)[0], 2)
    total_amount = round(base_total + tax + shipping_fee, 2)
    net_profit = round(total_amount - (cogs * qty) - shipping_fee, 2)

    # Müştəri CLV məlumatlarını yenilə
    cust["total_spent"] += total_amount
    cust["order_history"].append(total_amount)
    cust["lifetime_value"] = cust["total_spent"]

    # --- STATUS & ÇATDIRILMA ---
    # Status: aylar keçdikcə "Delivered" ehtimalı artır (keçmiş sifarişlər çatdırılıb)
    months_passed = (datetime(2025, 12, 31) - o_date).days / 30
    delivered_prob = min(0.92, 0.80 + months_passed * 0.005)
    status = random.choices(
        STATUS_OPTIONS,
        weights=[
            delivered_prob * 100,
            (1 - delivered_prob) * 40,
            (1 - delivered_prob) * 35,
            (1 - delivered_prob) * 15,
            (1 - delivered_prob) * 10
        ], k=1
    )[0]

    # Anbar seçimi (müştəri bölgəsinə ən yaxın)
    if cust_region in WAREHOUSE_REGIONS:
        warehouse = random.choice(WAREHOUSE_REGIONS[cust_region])
    else:
        warehouse = random.choice(WAREHOUSE_REGIONS["Central"])

    # Çatdırılma gün sayı (bölgələr arası məsafə nəzərə alınır)
    if warehouse.split("-")[1] in ["LAX", "SFO", "SEA", "PHX"] and cust_region == "West":
        base_days = random.randint(1, 2)
    elif warehouse.split("-")[1] in ["DFW", "ORD", "MSP"] and cust_region == "Central":
        base_days = random.randint(1, 2)
    elif warehouse.split("-")[1] in ["EWR", "ATL", "MIA", "IAD"] and cust_region == "East":
        base_days = random.randint(1, 2)
    else:
        base_days = random.randint(3, 5)  # Fərqli bölgə = daha uzun

    est_days = base_days if is_prime else base_days + random.randint(1, 3)

    # Bayram/Bazar günündə +1 gün əlavə
    if is_holiday_or_weekend(o_date):
        est_days += random.choices([0, 1], weights=[60, 40], k=1)[0]

    # --- ÇATDIRILMA TARİXİ (15% gecikmə ehtimalı) ---
    carrier = random.choices(CARRIERS, weights=[40, 25, 20, 8, 7], k=1)[0]
    if status == "Delivered":
        if random.random() < 0.15:
            delay = random.randint(1, 3)
            act_delivery_date = (o_date + timedelta(days=est_days + delay)).strftime('%Y-%m-%d %H:%M:%S')
        else:
            early = random.choices([0, 1], weights=[70, 30], k=1)[0]
            act_delivery_date = (o_date + timedelta(days=max(1, est_days - early))).strftime('%Y-%m-%d %H:%M:%S')
        shipping_carrier_final = carrier
    elif status == "Shipped":
        act_delivery_date = ""
        shipping_carrier_final = carrier
    elif status == "Returned":
        act_delivery_date = (o_date + timedelta(days=est_days)).strftime('%Y-%m-%d %H:%M:%S')
        shipping_carrier_final = carrier
    else:
        act_delivery_date = ""
        shipping_carrier_final = ""

    # --- FRAUD SKOR (real risk faktorları) ---
    fraud_score = 0.0
    # Yeni müştəri = daha yüksək risk
    if cust["join_date"] > datetime(2025, 1, 1):
        fraud_score += random.uniform(0.02, 0.10)
    # Aşağı CLV = riskli
    if cust["lifetime_value"] < 100:
        fraud_score += random.uniform(0.03, 0.12)
    # Yüksək dəyərli sifariş
    if total_amount > 500:
        fraud_score += random.uniform(0.05, 0.15)
    # Gift Card = riskli ödəniş
    if payment == "Gift Card":
        fraud_score += random.uniform(0.08, 0.20)
    # Ləğv olunubsa
    if status == "Cancelled":
        fraud_score += random.uniform(0.30, 0.50)
    fraud_score = min(round(fraud_score, 2), 0.99)

    # --- RETURN ---
    if status == "Returned":
        return_reason = random.choices(
            RETURN_REASONS,
            weights=[20, 10, 25, 20, 15, 10], k=1
        )[0]
        return_prob = round(random.uniform(0.40, 0.85), 2)
    else:
        return_reason = ""
        if cat == "Books":
            return_prob = round(random.uniform(0.01, 0.06), 2)
        elif cat == "Electronics":
            return_prob = round(random.uniform(0.08, 0.25), 2)
        elif cat == "Home & Kitchen":
            return_prob = round(random.uniform(0.05, 0.18), 2)
        else:
            return_prob = round(random.uniform(0.04, 0.15), 2)

    # --- RƏQABƏT QİYMƏTİ ---
    competitor_price = round(price * random.uniform(1 - price_var, 1 + price_var), 2)
    price_elasticity = round(random.uniform(0.5, 2.5), 2)
    buy_box = random.choices(["Yes", "No"], weights=[82, 18], k=1)[0]

    # --- SAYT DAVRANIŞI (cihazdan asılı) ---
    if final_device == "Mobile_App":
        time_on_page = random.randint(8, 90)
        click_count = random.randint(2, 12)
        cart_abandon = random.randint(0, 3)
    elif final_device == "Mobile_Web":
        time_on_page = random.randint(15, 150)
        click_count = random.randint(3, 18)
        cart_abandon = random.randint(0, 5)
    else:  # Desktop
        time_on_page = random.randint(45, 480)
        click_count = random.randint(6, 35)
        cart_abandon = random.randint(1, 7)

    # --- FİZİKİ XÜSUSİYYƏTLƏR (kateqoriyadan asılı) ---
    phys = CATEGORY_PHYSICAL[cat]
    weight = round(random.uniform(phys["weight"][0], phys["weight"][1]), 2)
    d = phys["dim"]
    dimensions = f"{random.randint(d[0][0], d[0][1])}x{random.randint(d[1][0], d[1][1])}x{random.randint(d[2][0], d[2][1])}"

    lead_time = random.randint(2, 14)
    hazmat = 1 if cat == "Electronics" and random.random() > 0.7 else 0
    clv = round(cust["lifetime_value"], 2)

    order_counter += 1
    order_id_str = f"AMZN-{10000000 + order_counter}"

    all_rows.append([
        order_id_str, session_id, o_date.strftime('%Y-%m-%d %H:%M:%S'), act_delivery_date,
        cust_id, int(is_prime), final_device, traffic, keyword, ad_campaign,
        asin, cat, prod_name, price, cogs, competitor_price, price_elasticity,
        qty, discount, tax, shipping_fee, total_amount, net_profit,
        payment, status, promo_type, return_reason,
        random.choice(["Sold by Amazon", "3rd-Party Merchant"]),
        warehouse, shipping_carrier_final, est_days,
        state, cust_region,
        rating, reviews, buy_box, return_prob, fraud_score,
        time_on_page, click_count, cart_abandon,
        weight, dimensions, lead_time, hazmat, clv
    ])

    if (row_idx + 1) % 200000 == 0:
        print(f"  Proqres: {row_idx + 1:,} / {TOTAL_ROWS:,} sətir yazıldı...")

# =============================================================================
# 6. CSV FAYLININ YAZILMASI
# =============================================================================

print(f"[4/4] CSV faylı yazılır: {FILENAME}")

with open(FILENAME, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)

    # 48 REAL ANALİTİK SÜTUN (əvvəlki 42 + 6 yeni)
    writer.writerow([
        "Order_ID", "Session_ID", "Order_Date", "Actual_Delivery_Date",
        "Customer_ID", "Is_Prime_Member", "Device_Type",
        "Traffic_Source", "Keywords_Used", "Ad_Campaign_ID",
        "ASIN", "Product_Category", "Product_Name",
        "Unit_Price", "COGS_Price", "Competitor_Price_At_Order", "Price_Elasticity_Score",
        "Quantity", "Discount_Amount", "Tax_Amount", "Shipping_Fee",
        "Total_Amount", "Net_Profit",
        "Payment_Method", "Order_Status", "Promotion_Type", "Return_Reason",
        "Seller_Type", "Warehouse_ID", "Shipping_Carrier", "Delivery_Days_Estimated",
        "Customer_State", "Customer_Region",
        "Product_Rating", "Review_Count", "Buy_Box_Eligible",
        "Return_Probability_Score", "Fraud_Score",
        "Time_On_Page_Sec", "Click_Stream_Count", "Cart_Abandonment_History",
        "Package_Weight_kg", "Package_Dimensions_cm",
        "Lead_Time_Days", "Hazmat_Status", "Customer_Lifetime_Value"
    ])

    for row in all_rows:
        writer.writerow(row)

file_size = os.path.getsize(FILENAME)
print(f"\nTebrikler! Realistik Amazon 'Big Data' CSV fayli hazirdir.")
print(f"  Fayl: {FILENAME}")
print(f"  Hecm: {file_size / (1024*1024):.1f} MB")
print(f"  Setir: {len(all_rows):,}")
print(f"  Sutun: 48")
print(f"  Unikal musteri: {NUM_CUSTOMERS:,}")
print(f"  Unikal mehsul: {PRODUCT_COUNT:,}")
print(f"  Yaxsileshmeler: Brand x Kateqoriya uygunlugu, Qayidan musteri modeli,")
print(f"    Detalli movsumluluq (Prime Day/Black Friday), Real catdirilma gecikmesi,")
print(f"    Risk faktorlu Fraud skor, Kateqoriyaya gore fiziki xususiyyetler,")
print(f"    Promotion/Return/Geography sutunlari")
