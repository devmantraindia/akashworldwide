#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for Digital Service Portal
Tests all 30 critical endpoints as per review request
"""

import requests
import json
import os
from datetime import datetime

# Read base URL from .env
BASE_URL = "https://digital-services-hub-66.preview.emergentagent.com/api"

# Test data
test_results = []
customer_token = None
admin_token = None
test_order_id = None
test_customer_email = f"testcustomer_{datetime.now().timestamp()}@example.com"

def log_test(test_num, description, passed, details=""):
    """Log test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    result = f"Test {test_num}: {status} - {description}"
    if details:
        result += f"\n    Details: {details}"
    print(result)
    test_results.append({
        "test": test_num,
        "description": description,
        "passed": passed,
        "details": details
    })
    return passed

def test_1_health_check():
    """Test 1: GET /api/ → returns { status: 'ok' }"""
    try:
        response = requests.get(f"{BASE_URL}/")
        data = response.json()
        passed = response.status_code == 200 and data.get("status") == "ok"
        log_test(1, "Health check endpoint", passed, 
                f"Status: {response.status_code}, Response: {data}")
        return passed
    except Exception as e:
        log_test(1, "Health check endpoint", False, str(e))
        return False

def test_2_get_services():
    """Test 2: GET /api/services → returns 152 services + 10 categories"""
    try:
        response = requests.get(f"{BASE_URL}/services")
        data = response.json()
        services_count = len(data.get("services", []))
        categories_count = len(data.get("categories", []))
        passed = (response.status_code == 200 and 
                 services_count == 152 and 
                 categories_count == 10)
        log_test(2, "Get all services", passed,
                f"Services: {services_count}, Categories: {categories_count}")
        return passed
    except Exception as e:
        log_test(2, "Get all services", False, str(e))
        return False

def test_3_get_popular_services():
    """Test 3: GET /api/services?popular=1 → returns subset (popular only)"""
    try:
        response = requests.get(f"{BASE_URL}/services?popular=1")
        data = response.json()
        services = data.get("services", [])
        all_popular = all(s.get("popular") for s in services)
        passed = response.status_code == 200 and len(services) > 0 and all_popular
        log_test(3, "Get popular services", passed,
                f"Found {len(services)} popular services")
        return passed
    except Exception as e:
        log_test(3, "Get popular services", False, str(e))
        return False

def test_4_get_services_by_category():
    """Test 4: GET /api/services?category=govt → returns only govt category"""
    try:
        response = requests.get(f"{BASE_URL}/services?category=govt")
        data = response.json()
        services = data.get("services", [])
        all_govt = all(s.get("category") == "govt" for s in services)
        passed = response.status_code == 200 and len(services) > 0 and all_govt
        log_test(4, "Get services by category", passed,
                f"Found {len(services)} govt services")
        return passed
    except Exception as e:
        log_test(4, "Get services by category", False, str(e))
        return False

def test_5_search_services():
    """Test 5: GET /api/services?q=pan → returns services matching 'pan'"""
    try:
        response = requests.get(f"{BASE_URL}/services?q=pan")
        data = response.json()
        services = data.get("services", [])
        has_pan = any("pan" in s.get("name", "").lower() for s in services)
        passed = response.status_code == 200 and len(services) > 0 and has_pan
        log_test(5, "Search services", passed,
                f"Found {len(services)} services matching 'pan'")
        return passed
    except Exception as e:
        log_test(5, "Search services", False, str(e))
        return False

def test_6_get_service_detail():
    """Test 6: GET /api/services/pan-card-new → returns single service detail"""
    try:
        response = requests.get(f"{BASE_URL}/services/pan-card-new")
        data = response.json()
        service = data.get("service")
        passed = (response.status_code == 200 and 
                 service is not None and 
                 service.get("slug") == "pan-card-new")
        log_test(6, "Get service detail", passed,
                f"Service: {service.get('name') if service else 'None'}")
        return passed
    except Exception as e:
        log_test(6, "Get service detail", False, str(e))
        return False

def test_7_get_public_stats():
    """Test 7: GET /api/stats/public → returns stats"""
    try:
        response = requests.get(f"{BASE_URL}/stats/public")
        data = response.json()
        required_keys = ["services", "users", "partners", "success", "orders"]
        has_all_keys = all(key in data for key in required_keys)
        passed = response.status_code == 200 and has_all_keys
        log_test(7, "Get public stats", passed,
                f"Stats: {data}")
        return passed
    except Exception as e:
        log_test(7, "Get public stats", False, str(e))
        return False

def test_8_get_public_settings():
    """Test 8: GET /api/settings/public → returns qrImage, upiId, payeeName"""
    try:
        response = requests.get(f"{BASE_URL}/settings/public")
        data = response.json()
        required_keys = ["qrImage", "upiId", "payeeName"]
        has_all_keys = all(key in data for key in required_keys)
        passed = response.status_code == 200 and has_all_keys
        log_test(8, "Get public settings", passed,
                f"Settings: {data}")
        return passed
    except Exception as e:
        log_test(8, "Get public settings", False, str(e))
        return False

def test_9_signup():
    """Test 9: POST /api/auth/signup → returns token + user"""
    global customer_token
    try:
        payload = {
            "name": "Test Customer",
            "email": test_customer_email,
            "password": "TestPass123!",
            "phone": "9876543210"
        }
        response = requests.post(f"{BASE_URL}/auth/signup", json=payload)
        data = response.json()
        customer_token = data.get("token")
        passed = (response.status_code == 200 and 
                 customer_token is not None and 
                 data.get("user") is not None)
        log_test(9, "Customer signup", passed,
                f"Token received: {bool(customer_token)}")
        return passed
    except Exception as e:
        log_test(9, "Customer signup", False, str(e))
        return False

def test_10_signup_duplicate():
    """Test 10: POST /api/auth/signup with same email → 400"""
    try:
        payload = {
            "name": "Test Customer",
            "email": test_customer_email,
            "password": "TestPass123!",
            "phone": "9876543210"
        }
        response = requests.post(f"{BASE_URL}/auth/signup", json=payload)
        data = response.json()
        passed = (response.status_code == 400 and 
                 "already registered" in data.get("error", "").lower())
        log_test(10, "Duplicate signup rejection", passed,
                f"Status: {response.status_code}, Error: {data.get('error')}")
        return passed
    except Exception as e:
        log_test(10, "Duplicate signup rejection", False, str(e))
        return False

def test_11_login_success():
    """Test 11: POST /api/auth/login with correct creds → token + user"""
    try:
        payload = {
            "email": test_customer_email,
            "password": "TestPass123!"
        }
        response = requests.post(f"{BASE_URL}/auth/login", json=payload)
        data = response.json()
        token = data.get("token")
        passed = (response.status_code == 200 and 
                 token is not None and 
                 data.get("user") is not None)
        log_test(11, "Customer login success", passed,
                f"Token received: {bool(token)}")
        return passed
    except Exception as e:
        log_test(11, "Customer login success", False, str(e))
        return False

def test_12_login_wrong_password():
    """Test 12: POST /api/auth/login with wrong password → 401"""
    try:
        payload = {
            "email": test_customer_email,
            "password": "WrongPassword123!"
        }
        response = requests.post(f"{BASE_URL}/auth/login", json=payload)
        data = response.json()
        passed = response.status_code == 401
        log_test(12, "Login with wrong password", passed,
                f"Status: {response.status_code}, Error: {data.get('error')}")
        return passed
    except Exception as e:
        log_test(12, "Login with wrong password", False, str(e))
        return False

def test_13_auth_me_with_token():
    """Test 13: GET /api/auth/me with Bearer token → returns user"""
    try:
        headers = {"Authorization": f"Bearer {customer_token}"}
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        data = response.json()
        user = data.get("user")
        passed = (response.status_code == 200 and 
                 user is not None and 
                 user.get("email") == test_customer_email)
        log_test(13, "Get current user with token", passed,
                f"User: {user.get('email') if user else 'None'}")
        return passed
    except Exception as e:
        log_test(13, "Get current user with token", False, str(e))
        return False

def test_14_auth_me_without_token():
    """Test 14: GET /api/auth/me without token → 401"""
    try:
        response = requests.get(f"{BASE_URL}/auth/me")
        passed = response.status_code == 401
        log_test(14, "Get current user without token", passed,
                f"Status: {response.status_code}")
        return passed
    except Exception as e:
        log_test(14, "Get current user without token", False, str(e))
        return False

def test_15_create_order():
    """Test 15: POST /api/orders → order created with status PENDING"""
    global test_order_id
    try:
        headers = {"Authorization": f"Bearer {customer_token}"}
        payload = {
            "serviceId": "pan-card-new",
            "formData": {
                "fullName": "Test User",
                "fatherName": "Test Father",
                "dob": "1990-01-01",
                "mobile": "9876543210"
            }
        }
        response = requests.post(f"{BASE_URL}/orders", json=payload, headers=headers)
        data = response.json()
        order = data.get("order")
        test_order_id = order.get("id") if order else None
        passed = (response.status_code == 200 and 
                 order is not None and 
                 order.get("status") == "PENDING")
        log_test(15, "Create order", passed,
                f"Order ID: {test_order_id}, Status: {order.get('status') if order else 'None'}")
        return passed
    except Exception as e:
        log_test(15, "Create order", False, str(e))
        return False

def test_16_get_customer_orders():
    """Test 16: GET /api/orders → returns customer's orders"""
    try:
        headers = {"Authorization": f"Bearer {customer_token}"}
        response = requests.get(f"{BASE_URL}/orders", headers=headers)
        data = response.json()
        orders = data.get("orders", [])
        passed = response.status_code == 200 and len(orders) > 0
        log_test(16, "Get customer orders", passed,
                f"Found {len(orders)} orders")
        return passed
    except Exception as e:
        log_test(16, "Get customer orders", False, str(e))
        return False

def test_17_get_order_detail():
    """Test 17: GET /api/orders/:id → returns order detail"""
    try:
        headers = {"Authorization": f"Bearer {customer_token}"}
        response = requests.get(f"{BASE_URL}/orders/{test_order_id}", headers=headers)
        data = response.json()
        order = data.get("order")
        passed = (response.status_code == 200 and 
                 order is not None and 
                 order.get("id") == test_order_id)
        log_test(17, "Get order detail", passed,
                f"Order ID: {order.get('id') if order else 'None'}")
        return passed
    except Exception as e:
        log_test(17, "Get order detail", False, str(e))
        return False

def test_18_submit_payment():
    """Test 18: POST /api/orders/:id/payment → status moves to VERIFICATION"""
    try:
        headers = {"Authorization": f"Bearer {customer_token}"}
        payload = {
            "transactionId": "UPI123456789",
            "name": "Test Customer",
            "mobile": "9876543210",
            "paymentTime": datetime.now().isoformat(),
            "screenshot": "https://example.com/screenshot.jpg"
        }
        response = requests.post(f"{BASE_URL}/orders/{test_order_id}/payment", 
                                json=payload, headers=headers)
        data = response.json()
        order = data.get("order")
        passed = (response.status_code == 200 and 
                 order is not None and 
                 order.get("status") == "VERIFICATION")
        log_test(18, "Submit payment proof", passed,
                f"Status: {order.get('status') if order else 'None'}")
        return passed
    except Exception as e:
        log_test(18, "Submit payment proof", False, str(e))
        return False

def test_19_admin_login():
    """Test 19: POST /api/admin/login with super_admin creds → token"""
    global admin_token
    try:
        payload = {
            "email": "info.akashworldwide@gmail.com",
            "password": "Admin@123"
        }
        response = requests.post(f"{BASE_URL}/admin/login", json=payload)
        data = response.json()
        admin_token = data.get("token")
        user = data.get("user")
        passed = (response.status_code == 200 and 
                 admin_token is not None and 
                 user.get("role") == "super_admin")
        log_test(19, "Admin login", passed,
                f"Token received: {bool(admin_token)}, Role: {user.get('role') if user else 'None'}")
        return passed
    except Exception as e:
        log_test(19, "Admin login", False, str(e))
        return False

def test_20_admin_login_customer_rejection():
    """Test 20: POST /api/admin/login with customer creds → rejected"""
    try:
        payload = {
            "email": test_customer_email,
            "password": "TestPass123!"
        }
        response = requests.post(f"{BASE_URL}/admin/login", json=payload)
        passed = response.status_code == 401
        log_test(20, "Admin login with customer creds rejection", passed,
                f"Status: {response.status_code}")
        return passed
    except Exception as e:
        log_test(20, "Admin login with customer creds rejection", False, str(e))
        return False

def test_21_admin_stats():
    """Test 21: GET /api/admin/stats → returns admin stats"""
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/stats", headers=headers)
        data = response.json()
        required_keys = ["totalOrders", "pending", "processing", "completed", 
                        "customers", "revenue", "chart"]
        has_all_keys = all(key in data for key in required_keys)
        chart_valid = isinstance(data.get("chart"), list) and len(data.get("chart", [])) == 7
        passed = response.status_code == 200 and has_all_keys and chart_valid
        log_test(21, "Get admin stats", passed,
                f"Stats keys present: {has_all_keys}, Chart days: {len(data.get('chart', []))}")
        return passed
    except Exception as e:
        log_test(21, "Get admin stats", False, str(e))
        return False

def test_22_admin_get_all_orders():
    """Test 22: GET /api/admin/orders → returns all orders"""
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/orders", headers=headers)
        data = response.json()
        orders = data.get("orders", [])
        passed = response.status_code == 200 and len(orders) > 0
        log_test(22, "Get all orders (admin)", passed,
                f"Found {len(orders)} orders")
        return passed
    except Exception as e:
        log_test(22, "Get all orders (admin)", False, str(e))
        return False

def test_23_admin_filter_orders():
    """Test 23: GET /api/admin/orders?status=VERIFICATION → filtered"""
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/orders?status=VERIFICATION", headers=headers)
        data = response.json()
        orders = data.get("orders", [])
        all_verification = all(o.get("status") == "VERIFICATION" for o in orders)
        passed = response.status_code == 200 and all_verification
        log_test(23, "Filter orders by status", passed,
                f"Found {len(orders)} VERIFICATION orders")
        return passed
    except Exception as e:
        log_test(23, "Filter orders by status", False, str(e))
        return False

def test_24_admin_get_customers():
    """Test 24: GET /api/admin/customers → returns customers list"""
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/customers", headers=headers)
        data = response.json()
        customers = data.get("customers", [])
        passed = response.status_code == 200 and len(customers) > 0
        log_test(24, "Get customers list", passed,
                f"Found {len(customers)} customers")
        return passed
    except Exception as e:
        log_test(24, "Get customers list", False, str(e))
        return False

def test_25_admin_verify_order():
    """Test 25: POST /api/admin/orders/:id/verify → status becomes PROCESSING"""
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.post(f"{BASE_URL}/admin/orders/{test_order_id}/verify", 
                                json={}, headers=headers)
        data = response.json()
        order = data.get("order")
        passed = (response.status_code == 200 and 
                 order is not None and 
                 order.get("status") == "PROCESSING")
        log_test(25, "Admin verify order", passed,
                f"Status: {order.get('status') if order else 'None'}")
        return passed
    except Exception as e:
        log_test(25, "Admin verify order", False, str(e))
        return False

def test_26_admin_complete_order():
    """Test 26: POST /api/admin/orders/:id/complete → status becomes COMPLETED"""
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.post(f"{BASE_URL}/admin/orders/{test_order_id}/complete", 
                                json={}, headers=headers)
        data = response.json()
        order = data.get("order")
        passed = (response.status_code == 200 and 
                 order is not None and 
                 order.get("status") == "COMPLETED")
        log_test(26, "Admin complete order", passed,
                f"Status: {order.get('status') if order else 'None'}")
        return passed
    except Exception as e:
        log_test(26, "Admin complete order", False, str(e))
        return False

def test_27_timeline_entries():
    """Test 27: Confirm timeline has entries at each transition"""
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/orders/{test_order_id}", headers=headers)
        data = response.json()
        order = data.get("order")
        timeline = order.get("timeline", []) if order else []
        # Should have: PENDING, VERIFICATION, PROCESSING, COMPLETED
        expected_statuses = ["PENDING", "VERIFICATION", "PROCESSING", "COMPLETED"]
        timeline_statuses = [t.get("status") for t in timeline]
        has_all_transitions = all(status in timeline_statuses for status in expected_statuses)
        passed = (response.status_code == 200 and 
                 len(timeline) >= 4 and 
                 has_all_transitions)
        log_test(27, "Timeline entries validation", passed,
                f"Timeline entries: {len(timeline)}, Statuses: {timeline_statuses}")
        return passed
    except Exception as e:
        log_test(27, "Timeline entries validation", False, str(e))
        return False

def test_28_admin_update_settings():
    """Test 28: POST /api/admin/settings → settings updated"""
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "qrImage": "https://example.com/new-qr.png",
            "upiId": "newtestpayment@upi",
            "payeeName": "Test Digital Portal"
        }
        response = requests.post(f"{BASE_URL}/admin/settings", json=payload, headers=headers)
        data = response.json()
        
        # Verify settings were updated
        settings_response = requests.get(f"{BASE_URL}/settings/public")
        settings_data = settings_response.json()
        
        passed = (response.status_code == 200 and 
                 data.get("ok") == True and
                 settings_data.get("upiId") == "newtestpayment@upi")
        log_test(28, "Admin update settings", passed,
                f"Settings updated: {settings_data}")
        return passed
    except Exception as e:
        log_test(28, "Admin update settings", False, str(e))
        return False

def test_29_customer_access_admin_endpoint():
    """Test 29: Customer token calling /api/admin/orders → 403"""
    try:
        headers = {"Authorization": f"Bearer {customer_token}"}
        response = requests.get(f"{BASE_URL}/admin/orders", headers=headers)
        passed = response.status_code == 403
        log_test(29, "Customer accessing admin endpoint", passed,
                f"Status: {response.status_code}")
        return passed
    except Exception as e:
        log_test(29, "Customer accessing admin endpoint", False, str(e))
        return False

def test_30_no_token_protected_endpoint():
    """Test 30: No token calling /api/orders → 401"""
    try:
        response = requests.get(f"{BASE_URL}/orders")
        passed = response.status_code == 401
        log_test(30, "No token accessing protected endpoint", passed,
                f"Status: {response.status_code}")
        return passed
    except Exception as e:
        log_test(30, "No token accessing protected endpoint", False, str(e))
        return False

def main():
    """Run all tests"""
    print("=" * 80)
    print("DIGITAL SERVICE PORTAL - BACKEND API TEST SUITE")
    print("=" * 80)
    print(f"Base URL: {BASE_URL}")
    print(f"Test started at: {datetime.now().isoformat()}")
    print("=" * 80)
    print()
    
    # Run all tests in order
    tests = [
        test_1_health_check,
        test_2_get_services,
        test_3_get_popular_services,
        test_4_get_services_by_category,
        test_5_search_services,
        test_6_get_service_detail,
        test_7_get_public_stats,
        test_8_get_public_settings,
        test_9_signup,
        test_10_signup_duplicate,
        test_11_login_success,
        test_12_login_wrong_password,
        test_13_auth_me_with_token,
        test_14_auth_me_without_token,
        test_15_create_order,
        test_16_get_customer_orders,
        test_17_get_order_detail,
        test_18_submit_payment,
        test_19_admin_login,
        test_20_admin_login_customer_rejection,
        test_21_admin_stats,
        test_22_admin_get_all_orders,
        test_23_admin_filter_orders,
        test_24_admin_get_customers,
        test_25_admin_verify_order,
        test_26_admin_complete_order,
        test_27_timeline_entries,
        test_28_admin_update_settings,
        test_29_customer_access_admin_endpoint,
        test_30_no_token_protected_endpoint,
    ]
    
    passed_count = 0
    failed_count = 0
    
    for test_func in tests:
        try:
            if test_func():
                passed_count += 1
            else:
                failed_count += 1
        except Exception as e:
            print(f"ERROR running {test_func.__name__}: {e}")
            failed_count += 1
        print()
    
    # Summary
    print("=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    print(f"Total Tests: {len(tests)}")
    print(f"✅ Passed: {passed_count}")
    print(f"❌ Failed: {failed_count}")
    print(f"Success Rate: {(passed_count/len(tests)*100):.1f}%")
    print("=" * 80)
    
    # Failed tests detail
    if failed_count > 0:
        print("\nFAILED TESTS:")
        for result in test_results:
            if not result["passed"]:
                print(f"  - Test {result['test']}: {result['description']}")
                if result["details"]:
                    print(f"    {result['details']}")
    
    return failed_count == 0

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
