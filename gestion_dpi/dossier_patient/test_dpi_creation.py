from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager  # Automatically manage driver
from selenium.webdriver.chrome.options import Options  # To set Chrome options
import time

# Path to the Chrome binary
chrome_binary_path = "/usr/bin/google-chrome"  # Path to the Google Chrome binary

# Setup Chrome options and set binary location
chrome_options = Options()
chrome_options.binary_location = chrome_binary_path  # Specify the Chrome binary location

# Setup Chrome service and use the driver manager to get the right chromedriver
service = Service(ChromeDriverManager().install())

# Create a WebDriver instance with the Service and options
driver = webdriver.Chrome(service=service, options=chrome_options)

# Open the form page (Create DPI)
driver.get("http://127.0.0.1:8000/dossier_patient/")

# Fill out the form (without the QR code field)
driver.find_element(By.NAME, "nss").send_keys("1234567")
driver.find_element(By.NAME, "nom").send_keys("Lina")
driver.find_element(By.NAME, "prenom").send_keys("Hamadache")
driver.find_element(By.NAME, "date_naissance").send_keys("01/01/2000")
driver.find_element(By.NAME, "adresse").send_keys("123 Street")
driver.find_element(By.NAME, "telephone").send_keys("0551234567")
driver.find_element(By.NAME, "mutuelle").send_keys("Cnas")

# Submit the form (adjust with the actual name of the submit button)
driver.find_element(By.NAME, "submit").click()

# Wait for the form to be processed and the page to update (QR code should be generated)
time.sleep(3)  # You can adjust this delay depending on how long the page takes to process

# Check if the QR code is displayed
# You may need to adjust the selector (e.g., By.ID, By.CLASS_NAME) based on your actual HTML
try:
    qr_code_element = driver.find_element(By.ID, "qr_code_image")  # Adjust based on the actual ID or class
    if qr_code_element.is_displayed():
        print("QR code is generated and displayed!")
    else:
        print("QR code was not displayed.")
except Exception as e:
    print(f"Error: {e}")

# Wait for the result (if needed)
time.sleep(5)

# Close the browser window
driver.quit()
