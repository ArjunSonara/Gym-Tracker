import os
import sys
import urllib.request
import zipfile
import subprocess
import shutil

SDK_DIR = os.path.expanduser(r"~\AppData\Local\Android\Sdk")
CMDLINE_DIR = os.path.join(SDK_DIR, "cmdline-tools")
LATEST_DIR = os.path.join(CMDLINE_DIR, "latest")
ZIP_URL = "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip"
ZIP_PATH = os.path.join(os.environ.get("TEMP", r"C:\Windows\Temp"), "cmdline-tools.zip")

print("SDK_DIR:", SDK_DIR)
os.makedirs(SDK_DIR, exist_ok=True)
os.makedirs(CMDLINE_DIR, exist_ok=True)

if not os.path.exists(os.path.join(LATEST_DIR, "bin", "sdkmanager.bat")):
    print("Downloading Android command line tools...")
    urllib.request.urlretrieve(ZIP_URL, ZIP_PATH)
    print("Extracting...")
    with zipfile.ZipFile(ZIP_PATH, 'r') as zip_ref:
        zip_ref.extractall(CMDLINE_DIR)
    
    extracted_folder = os.path.join(CMDLINE_DIR, "cmdline-tools")
    if os.path.exists(extracted_folder):
        if os.path.exists(LATEST_DIR):
            shutil.rmtree(LATEST_DIR)
        shutil.move(extracted_folder, LATEST_DIR)
    
    if os.path.exists(ZIP_PATH):
        os.remove(ZIP_PATH)
    print("Extracted to:", LATEST_DIR)
else:
    print("Command line tools already present at:", LATEST_DIR)

sdkmanager = os.path.join(LATEST_DIR, "bin", "sdkmanager.bat")
java_home = r"C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot"
env = os.environ.copy()
env["JAVA_HOME"] = java_home
env["ANDROID_HOME"] = SDK_DIR
env["PATH"] = f"{java_home}\\bin;{LATEST_DIR}\\bin;{env.get('PATH', '')}"

print("Accepting licenses and installing platform 35 & build-tools...")
# Accept licenses
proc = subprocess.Popen([sdkmanager, f"--sdk_root={SDK_DIR}", "--licenses"], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, env=env)
stdout, stderr = proc.communicate(input="y\ny\ny\ny\ny\ny\ny\ny\ny\ny\ny\n")
print("Licenses accepted.")

# Install platform and build-tools
cmd = [sdkmanager, f"--sdk_root={SDK_DIR}", "platforms;android-35", "build-tools;35.0.0", "platform-tools"]
print("Running:", " ".join(cmd))
res = subprocess.run(cmd, capture_output=True, text=True, env=env)
print("sdkmanager output:", res.stdout[-500:] if len(res.stdout) > 500 else res.stdout)
if res.returncode != 0:
    print("sdkmanager error:", res.stderr)

print("SDK Setup complete!")
