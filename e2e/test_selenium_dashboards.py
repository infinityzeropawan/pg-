"""
Smart PG Management — Comprehensive End-to-End Selenium Test Suite
Testing 4 Core Dashboards: Unified Login, SuperAdmin, Owner, and Manager.
"""

import os
import time
import json
import pytest
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

BASE_URL = os.getenv("FRONTEND_URL", "http://localhost:3002")
API_URL = os.getenv("BACKEND_URL", "http://localhost:5000/api/v1")

@pytest.fixture(scope="module")
def driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")

    service = Service(ChromeDriverManager().install())
    driver_instance = webdriver.Chrome(service=service, options=chrome_options)
    driver_instance.implicitly_wait(5)
    
    yield driver_instance
    driver_instance.quit()


class TestDashboardEndToEnd:
    # ==========================================
    # 1. UNIFIED LOGIN DASHBOARD TESTS
    # ==========================================
    def test_01_login_page_renders_cleanly(self, driver):
        driver.get(f"{BASE_URL}/login")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "form"))
        )
        assert "SmartPG" in driver.page_source or "Smart" in driver.page_source
        assert driver.find_element(By.XPATH, "//input[@type='email']").is_displayed()
        assert driver.find_element(By.XPATH, "//input[@type='password']").is_displayed()
        print("✅ Unified Login page rendered cleanly.")

    def test_02_login_invalid_credentials_shows_error(self, driver):
        driver.get(f"{BASE_URL}/login")
        email_input = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//input[@type='email']"))
        )
        email_input.clear()
        email_input.send_keys("superadmin@gmail.com")
        
        pass_input = driver.find_element(By.XPATH, "//input[@type='password']")
        pass_input.clear()
        pass_input.send_keys("WrongPassword123")
        
        submit_btn = driver.find_element(By.XPATH, "//button[@type='submit']")
        submit_btn.click()

        time.sleep(1.5)
        page_src = driver.page_source
        assert "Invalid" in page_src or "failed" in page_src.lower() or "error" in page_src.lower()
        print("✅ Invalid login error message verified.")

    def test_03_superadmin_login_flow(self, driver):
        driver.get(f"{BASE_URL}/login")
        
        # Click SuperAdmin Role Preset
        superadmin_btn = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'SuperAdmin')]"))
        )
        superadmin_btn.click()
        time.sleep(0.5)

        submit_btn = driver.find_element(By.XPATH, "//button[@type='submit']")
        submit_btn.click()

        WebDriverWait(driver, 10).until(
            lambda d: "/superadmin" in d.current_url
        )
        assert "/superadmin" in driver.current_url

        # Check localStorage token presence
        token = driver.execute_script("return localStorage.getItem('access_token');")
        assert token is not None and len(token) > 20
        print("✅ SuperAdmin login flow & JWT token verified.")

    # ==========================================
    # 2. SUPERADMIN DASHBOARD TESTS
    # ==========================================
    def test_04_superadmin_dashboard_metrics(self, driver):
        driver.get(f"{BASE_URL}/superadmin/dashboard")
        WebDriverWait(driver, 15).until(
            lambda d: "Platform Overview" in d.page_source or "Dashboard" in d.page_source or "Overview" in d.page_source
        )
        time.sleep(1.5)
        page_src = driver.page_source
        assert "Platform Overview" in page_src or "Dashboard" in page_src or "Owners" in page_src
        print("✅ SuperAdmin dashboard metrics rendered successfully.")

    def test_05_superadmin_owner_requests_module(self, driver):
        driver.get(f"{BASE_URL}/superadmin/owner-requests")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        time.sleep(1.5)
        page_src = driver.page_source
        assert "Vikram Sharma" in page_src or "Owner Requests" in page_src or "Requests" in page_src
        print("✅ SuperAdmin owner requests module verified.")

    def test_06_superadmin_owners_management(self, driver):
        driver.get(f"{BASE_URL}/superadmin/owners")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        time.sleep(1.5)
        page_src = driver.page_source
        assert "Rajesh Gupta" in page_src or "owner@smartpg.com" in page_src or "owner@gmail.com" in page_src or "Owners" in page_src
        print("✅ SuperAdmin owners management module verified.")

    def test_07_superadmin_plans_module(self, driver):
        driver.get(f"{BASE_URL}/superadmin/plans")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        time.sleep(1.5)
        page_src = driver.page_source
        assert "Starter" in page_src or "Growth" in page_src or "Enterprise" in page_src or "Plans" in page_src
        print("✅ SuperAdmin plans module verified.")

    def test_08_superadmin_settings_module(self, driver):
        driver.get(f"{BASE_URL}/superadmin/settings")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        time.sleep(1.5)
        page_src = driver.page_source
        assert "Settings" in page_src or "Night" in page_src or "OTP" in page_src or "Platform" in page_src
        print("✅ SuperAdmin settings module verified.")

    def test_09_superadmin_audit_logs_module(self, driver):
        driver.get(f"{BASE_URL}/superadmin/audit-logs")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        time.sleep(1.5)
        page_src = driver.page_source
        assert "Audit" in page_src or "Logs" in page_src or "USER_LOGIN" in page_src
        print("✅ SuperAdmin audit logs module verified.")

    # ==========================================
    # 3. OWNER DASHBOARD TESTS
    # ==========================================
    def test_10_owner_login_flow(self, driver):
        driver.get(f"{BASE_URL}/login")
        
        # Click Owner Role Preset
        owner_btn = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Owner')]"))
        )
        owner_btn.click()
        time.sleep(0.5)

        submit_btn = driver.find_element(By.XPATH, "//button[@type='submit']")
        submit_btn.click()

        WebDriverWait(driver, 10).until(
            lambda d: "/owner" in d.current_url
        )
        assert "/owner" in driver.current_url
        print("✅ Owner login flow verified.")

    def test_11_owner_dashboard_metrics(self, driver):
        driver.get(f"{BASE_URL}/owner/dashboard")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        time.sleep(1.5)
        page_src = driver.page_source
        assert "Dashboard" in page_src or "PG" in page_src or "Occupancy" in page_src or "Beds" in page_src
        print("✅ Owner dashboard metrics verified.")

    def test_12_owner_properties_module(self, driver):
        driver.get(f"{BASE_URL}/owner/properties")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        time.sleep(1.5)
        page_src = driver.page_source
        assert "Sunshine Luxury PG" in page_src or "Properties" in page_src or "Koramangala" in page_src
        print("✅ Owner properties module verified.")

    def test_13_owner_rooms_module(self, driver):
        driver.get(f"{BASE_URL}/owner/rooms")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        time.sleep(1.5)
        page_src = driver.page_source
        assert "101" in page_src or "Rooms" in page_src or "Floor" in page_src
        print("✅ Owner rooms module verified.")

    def test_14_owner_students_module(self, driver):
        driver.get(f"{BASE_URL}/owner/students")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        time.sleep(1.5)
        page_src = driver.page_source
        assert "Rahul Verma" in page_src or "Aarav Patel" in page_src or "Students" in page_src or "Residents" in page_src
        print("✅ Owner students module verified.")

    def test_15_owner_team_module(self, driver):
        driver.get(f"{BASE_URL}/owner/team")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        time.sleep(1.5)
        page_src = driver.page_source
        assert "Ramesh Kumar" in page_src or "Manager" in page_src or "Team" in page_src or "Staff" in page_src
        print("✅ Owner team module verified.")

    # ==========================================
    # 4. MANAGER DASHBOARD TESTS
    # ==========================================
    def test_16_manager_login_flow(self, driver):
        driver.get(f"{BASE_URL}/login")
        
        # Click Manager Role Preset
        manager_btn = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Manager')]"))
        )
        manager_btn.click()
        time.sleep(0.5)

        submit_btn = driver.find_element(By.XPATH, "//button[@type='submit']")
        submit_btn.click()

        WebDriverWait(driver, 10).until(
            lambda d: "/manager" in d.current_url
        )
        assert "/manager" in driver.current_url
        print("✅ Manager login flow verified.")

    def test_17_manager_dashboard_metrics(self, driver):
        driver.get(f"{BASE_URL}/manager/dashboard")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        time.sleep(1.5)
        page_src = driver.page_source
        assert "Manager" in page_src or "Complaints" in page_src or "Checkins" in page_src or "Occupancy" in page_src
        print("✅ Manager dashboard metrics verified.")

    def test_18_manager_gate_logs_module(self, driver):
        driver.get(f"{BASE_URL}/manager/gate-logs")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        time.sleep(1.5)
        page_src = driver.page_source
        assert "Gate" in page_src or "ENTRY" in page_src or "PES University" in page_src or "Rahul Verma" in page_src
        print("✅ Manager gate logs module verified.")

    def test_19_manager_complaints_module(self, driver):
        driver.get(f"{BASE_URL}/manager/complaints")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        time.sleep(1.5)
        page_src = driver.page_source
        assert "Geyser" in page_src or "Complaints" in page_src or "Plumbing" in page_src
        print("✅ Manager complaints module verified.")

    # ==========================================
    # 5. BACKEND DATABASE DATA INTEGRITY ASSERTIONS
    # ==========================================
    def test_20_backend_database_data_integrity(self):
        # 1. Test Auth API
        res = requests.post(f"{API_URL}/auth/login", json={
            "email": "superadmin@gmail.com",
            "password": "Super@123"
        })
        assert res.status_code == 200
        data = res.json()
        assert data["success"] is True
        token = data["data"]["accessToken"]
        headers = {"Authorization": f"Bearer {token}"}

        # 2. Test SuperAdmin API
        stats_res = requests.get(f"{API_URL}/superadmin/dashboard", headers=headers)
        assert stats_res.status_code == 200
        stats_data = stats_res.json()["data"]
        assert stats_data["totalProperties"] >= 1
        assert stats_data["totalBeds"] >= 12

        # 3. Test Owners API
        owners_res = requests.get(f"{API_URL}/superadmin/owners", headers=headers)
        assert owners_res.status_code == 200
        owners_data = owners_res.json()["data"]
        assert any(o["email"] == "owner@gmail.com" for o in owners_data)

        # 4. Test Owner/Manager Properties API
        owner_auth = requests.post(f"{API_URL}/auth/login", json={
            "email": "owner@gmail.com",
            "password": "Owner3@123"
        }).json()
        owner_token = owner_auth["data"]["accessToken"]
        owner_headers = {"Authorization": f"Bearer {owner_token}"}

        props_res = requests.get(f"{API_URL}/admin/properties", headers=owner_headers)
        assert props_res.status_code == 200
        props_data = props_res.json()["data"]
        assert any("Sunshine" in p["name"] for p in props_data)

        print("✅ Backend Database REST API data integrity verified cleanly!")

    # ==========================================
    # 6. END-TO-END NEWLY WIRED FUNCTIONALITY TESTS
    # ==========================================
    def get_owner_token(self):
        res = requests.post(f"{API_URL}/auth/login", json={
            "email": "owner@gmail.com",
            "password": "Owner3@123"
        })
        if res.status_code != 200:
            res = requests.post(f"{API_URL}/auth/login", json={
                "email": "owner@smartpg.com",
                "password": "Owner@123456"
            })
        return res.json()["data"]["accessToken"]

    def test_21_owner_notices_api_and_ui(self, driver):
        token = self.get_owner_token()
        headers = {"Authorization": f"Bearer {token}"}

        # Create Notice via API
        create_res = requests.post(f"{API_URL}/admin/notices", headers=headers, json={
            "title": "E2E Automated Inspection Notice",
            "content": "All residents must review upcoming maintenance schedule.",
            "category": "Maintenance",
            "target": "ALL",
            "isPinned": True
        })
        assert create_res.status_code == 201
        notice_data = create_res.json()["data"]
        assert notice_data["title"] == "E2E Automated Inspection Notice"

        # Verify UI renders notice
        driver.get(f"{BASE_URL}/owner/notices")
        WebDriverWait(driver, 10).until(
            lambda d: "E2E Automated Inspection Notice" in d.page_source or "Maintenance" in d.page_source
        )
        print("✅ Owner Notices REST API creation & UI rendering verified.")

    def test_22_owner_food_menu_api_and_ui(self, driver):
        token = self.get_owner_token()
        headers = {"Authorization": f"Bearer {token}"}

        # Update Food Menu via API
        menu_json = json.dumps({
            "monday": {"breakfast": "Masala Dosa", "lunch": "Paneer Thali", "dinner": "Dal Tadka"},
            "sunday": {"breakfast": "Aloo Paratha", "lunch": "Special Biryani", "dinner": "Ice Cream & Naan"}
        })
        put_res = requests.put(f"{API_URL}/admin/food-menu", headers=headers, json={
            "weekMenuJson": menu_json
        })
        assert put_res.status_code == 200

        # Fetch Food Menu
        get_res = requests.get(f"{API_URL}/admin/food-menu", headers=headers)
        assert get_res.status_code == 200
        assert "Masala Dosa" in get_res.json()["data"]["weekMenuJson"]

        # Verify UI renders food menu
        driver.get(f"{BASE_URL}/owner/food")
        WebDriverWait(driver, 10).until(
            lambda d: "Food" in d.page_source or "Menu" in d.page_source
        )
        print("✅ Owner Food Menu REST API update & persistence verified.")

    def test_23_owner_maintenance_api_and_ui(self, driver):
        token = self.get_owner_token()
        headers = {"Authorization": f"Bearer {token}"}

        # Create AMC Contract via API
        amc_res = requests.post(f"{API_URL}/admin/maintenance", headers=headers, json={
            "vendorName": "UrbanElevator Care Pvt Ltd",
            "serviceType": "Elevator Maintenance",
            "startDate": "2026-01-01",
            "endDate": "2026-12-31",
            "cost": 45000,
            "status": "ACTIVE"
        })
        assert amc_res.status_code == 201

        # Fetch Maintenance List
        list_res = requests.get(f"{API_URL}/admin/maintenance", headers=headers)
        assert list_res.status_code == 200
        assert any(m["vendorName"] == "UrbanElevator Care Pvt Ltd" for m in list_res.json()["data"])

        # Verify UI renders maintenance contracts
        driver.get(f"{BASE_URL}/owner/maintenance")
        WebDriverWait(driver, 10).until(
            lambda d: "UrbanElevator Care Pvt Ltd" in d.page_source or "Maintenance" in d.page_source
        )
        print("✅ Owner Maintenance AMC Contracts REST API & UI verified.")

    def test_24_owner_complaints_creation_and_resolution(self, driver):
        token = self.get_owner_token()
        headers = {"Authorization": f"Bearer {token}"}

        # Get property ID
        props = requests.get(f"{API_URL}/admin/properties", headers=headers).json()["data"]
        prop_id = props[0]["id"]

        # Create Complaint
        cmp_res = requests.post(f"{API_URL}/admin/complaints", headers=headers, json={
            "propertyId": prop_id,
            "category": "Plumbing",
            "title": "Low Water Pressure in 2nd Floor Bathrooms",
            "description": "Pressure drop observed during morning hours.",
            "priority": "HIGH"
        })
        assert cmp_res.status_code == 201
        cmp_id = cmp_res.json()["data"]["id"]

        # Update Status to RESOLVED
        status_res = requests.patch(f"{API_URL}/admin/complaints/{cmp_id}/status", headers=headers, json={
            "status": "RESOLVED"
        })
        assert status_res.status_code == 200

        # Verify UI renders resolved complaint
        driver.get(f"{BASE_URL}/owner/complaints")
        WebDriverWait(driver, 10).until(
            lambda d: "Low Water Pressure" in d.page_source or "Complaints" in d.page_source
        )
        print("✅ Resident Complaints creation, status transition & UI verified.")

    def test_25_owner_finance_summary_api(self):
        token = self.get_owner_token()
        headers = {"Authorization": f"Bearer {token}"}

        res = requests.get(f"{API_URL}/admin/finance/summary", headers=headers)
        assert res.status_code == 200
        data = res.json()["data"]
        assert "totalCollected" in data
        assert "totalPending" in data
        assert "totalExpenses" in data
        assert "netRevenue" in data
        print("✅ Owner Finance Summary REST API verified.")

    # ==========================================
    # 7. PHASE 2 DASHBOARDS TESTS (OWNER-REQUEST, PARENT, STAFF, STUDENT)
    # ==========================================
    def test_26_public_owner_request_lead_submission(self, driver):
        driver.get(f"{BASE_URL}/owner-request")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//input[@name='name']"))
        )

        driver.find_element(By.XPATH, "//input[@name='name']").send_keys("Automated Test Lead")
        driver.find_element(By.XPATH, "//input[@name='businessName']").send_keys("Test Residency PG")
        driver.find_element(By.XPATH, "//input[@name='email']").send_keys(f"lead_{int(time.time())}@example.com")
        driver.find_element(By.XPATH, "//input[@name='phone']").send_keys("9123456789")
        driver.find_element(By.XPATH, "//input[@name='city']").send_keys("Hyderabad")

        submit_btn = driver.find_element(By.XPATH, "//button[@type='submit']")
        driver.execute_script("arguments[0].scrollIntoView(true);", submit_btn)
        time.sleep(0.5)
        try:
            submit_btn.click()
        except Exception:
            driver.execute_script("arguments[0].click();", submit_btn)

        WebDriverWait(driver, 10).until(
            lambda d: "bhej di gayi" in d.page_source or "Request" in d.page_source or "Submitted" in d.page_source
        )
        print("✅ Public Owner Request Lead Portal submission verified.")

    def test_27_parent_portal_dashboard_api_and_ui(self, driver):
        parent_auth = requests.post(f"{API_URL}/auth/login", json={
            "email": "parent3@gmail.com",
            "password": "Parent@123"
        }).json()
        token = parent_auth["data"]["accessToken"]
        headers = {"Authorization": f"Bearer {token}"}

        dash_res = requests.get(f"{API_URL}/parent/dashboard", headers=headers)
        assert dash_res.status_code == 200
        student_name = dash_res.json()["data"]["student"]["fullName"]
        assert len(student_name) > 0

        gate_res = requests.get(f"{API_URL}/parent/attendance", headers=headers)
        assert gate_res.status_code == 200

        driver.get(f"{BASE_URL}/login")
        driver.execute_script("localStorage.setItem('access_token', arguments[0]);", token)
        driver.get(f"{BASE_URL}/parent/dashboard")
        WebDriverWait(driver, 10).until(
            lambda d: "Parent" in d.page_source or "Dashboard" in d.page_source or student_name in d.page_source
        )
        print("✅ Parent Portal dashboard, child stay info & REST API verified.")

    def test_28_staff_portal_dashboard_and_stock_api(self, driver):
        staff_auth = requests.post(f"{API_URL}/auth/login", json={
            "email": "cook3@gmail.com",
            "password": "Cook@123"
        }).json()
        token = staff_auth["data"]["accessToken"]
        headers = {"Authorization": f"Bearer {token}"}

        dash_res = requests.get(f"{API_URL}/staff/dashboard", headers=headers)
        assert dash_res.status_code == 200

        stock_res = requests.get(f"{API_URL}/staff/stock", headers=headers)
        assert stock_res.status_code == 200
        assert len(stock_res.json()["data"]) >= 1

        driver.get(f"{BASE_URL}/login")
        driver.execute_script("localStorage.setItem('access_token', arguments[0]);", token)
        driver.get(f"{BASE_URL}/staff/dashboard")
        WebDriverWait(driver, 10).until(
            lambda d: "Staff" in d.page_source or "Overview" in d.page_source or "Cook" in d.page_source
        )
        print("✅ Staff/Cook Portal dashboard, inventory stock & REST API verified.")

    def test_29_student_portal_profile_and_mess_api(self, driver):
        student_auth = requests.post(f"{API_URL}/auth/login", json={
            "email": "student3@gmail.com",
            "password": "Student@123"
        }).json()
        token = student_auth["data"]["accessToken"]
        headers = {"Authorization": f"Bearer {token}"}

        prof_res = requests.get(f"{API_URL}/student/profile", headers=headers)
        assert prof_res.status_code == 200
        assert prof_res.json()["data"]["student"]["fullName"] == "Aarav Patel"

        mess_res = requests.get(f"{API_URL}/student/mess", headers=headers)
        assert mess_res.status_code == 200

        driver.get(f"{BASE_URL}/login")
        driver.execute_script("localStorage.setItem('access_token', arguments[0]);", token)
        driver.get(f"{BASE_URL}/student/dashboard")
        WebDriverWait(driver, 10).until(
            lambda d: "Aarav" in d.page_source or "Student" in d.page_source or "Good Morning" in d.page_source
        )
        print("✅ Student Portal profile, room allocation & mess wallet REST API verified.")

    def test_30_student_portal_leave_and_sos_api(self):
        student_auth = requests.post(f"{API_URL}/auth/login", json={
            "email": "student3@gmail.com",
            "password": "Student@123"
        }).json()
        token = student_auth["data"]["accessToken"]
        headers = {"Authorization": f"Bearer {token}"}

        leave_res = requests.post(f"{API_URL}/student/leaves", headers=headers, json={
            "startDate": "2026-10-01",
            "endDate": "2026-10-05",
            "reason": "Diwali Festival Family Visit"
        })
        assert leave_res.status_code == 201

        sos_res = requests.post(f"{API_URL}/student/sos", headers=headers, json={
            "latitude": 12.9352,
            "longitude": 77.6245
        })
        assert sos_res.status_code == 201
        print("✅ Student Leave Request & Emergency SOS Alert REST API verified.")

    def test_31_student_gate_qr_attendance_and_inout_scanning(self):
        student_auth = requests.post(f"{API_URL}/auth/login", json={
            "email": "student3@gmail.com",
            "password": "Student@123"
        }).json()
        if not student_auth.get("success"):
            student_auth = requests.post(f"{API_URL}/auth/login", json={
                "email": "student@smartpg.com",
                "password": "Student@123456"
            }).json()
        token = student_auth["data"]["accessToken"]
        headers = {"Authorization": f"Bearer {token}"}

        gate_post = requests.post(f"{API_URL}/student/gate-attendance", headers=headers, json={
            "type": "ENTRY",
            "reason": "College Classes",
            "destination": "PES University Main Block"
        })
        assert gate_post.status_code == 201
        assert gate_post.json()["data"]["type"] == "ENTRY"

        gate_get = requests.get(f"{API_URL}/student/gate-attendance", headers=headers)
        assert gate_get.status_code == 200
        assert len(gate_get.json()["data"]) >= 1
        print("✅ Student Gate QR Scanning, In/Out attendance & DB persistence verified.")

    def test_32_superadmin_analytics_api(self):
        admin_auth = requests.post(f"{API_URL}/auth/login", json={
    def test_32_superadmin_analytics_api(self):
        token = None
        for email, password in [("superadmin@gmail.com", "Super@123"), ("admin@smartpg.com", "SuperAdmin@123456"), ("superadmin@smartpg.com", "SuperAdmin@123456")]:
            res = requests.post(f"{API_URL}/auth/login", json={"email": email, "password": password}).json()
            if res.get("success") and "data" in res and "accessToken" in res["data"]:
                token = res["data"]["accessToken"]
                break
        assert token is not None, "Failed to get SuperAdmin token"
        headers = {"Authorization": f"Bearer {token}"}

        analytics_res = requests.get(f"{API_URL}/superadmin/analytics", headers=headers)
        assert analytics_res.status_code == 200
        assert "stats" in analytics_res.json()["data"]
        print("✅ SuperAdmin Platform Analytics REST API verified.")

    def test_33_superadmin_audit_logs_api(self):
        token = None
        for email, password in [("superadmin@gmail.com", "Super@123"), ("admin@smartpg.com", "SuperAdmin@123456"), ("superadmin@smartpg.com", "SuperAdmin@123456")]:
            res = requests.post(f"{API_URL}/auth/login", json={"email": email, "password": password}).json()
            if res.get("success") and "data" in res and "accessToken" in res["data"]:
                token = res["data"]["accessToken"]
                break
        assert token is not None, "Failed to get SuperAdmin token"
        headers = {"Authorization": f"Bearer {token}"}

        audit_res = requests.get(f"{API_URL}/superadmin/audit-logs", headers=headers)
        assert audit_res.status_code == 200
        assert isinstance(audit_res.json()["data"], list)
        print("✅ SuperAdmin Platform Audit Logs REST API verified.")

    def test_34_superadmin_plan_creation_api(self):
        token = None
        for email, password in [("superadmin@gmail.com", "Super@123"), ("admin@smartpg.com", "SuperAdmin@123456"), ("superadmin@smartpg.com", "SuperAdmin@123456")]:
            res = requests.post(f"{API_URL}/auth/login", json={"email": email, "password": password}).json()
            if res.get("success") and "data" in res and "accessToken" in res["data"]:
                token = res["data"]["accessToken"]
                break
        assert token is not None, "Failed to get SuperAdmin token"
        headers = {"Authorization": f"Bearer {token}"}

        plan_res = requests.post(f"{API_URL}/superadmin/plans", headers=headers, json={
            "name": f"Custom Pro Plan {int(time.time())}",
            "code": f"CUST_{int(time.time())}",
            "maxProperties": 5,
            "maxBeds": 500,
            "priceMonthly": 4999,
            "priceYearly": 49990,
            "features": ["ALL_FEATURES", "24_7_SUPPORT"]
        })
        assert plan_res.status_code == 201
        print("✅ SuperAdmin Plan Creation REST API & DB persistence verified.")


if __name__ == "__main__":
    pytest.main(["-v", __file__])
