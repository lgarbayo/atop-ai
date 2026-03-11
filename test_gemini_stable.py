import urllib.request
import json
import sys

def test_model(api_key, model_name, version="v1beta"):
    url = f"https://generativelanguage.googleapis.com/{version}/models/{model_name}:generateContent?key={api_key}"
    payload = {"contents": [{"parts": [{"text": "Hello"}]}]}
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Testing {model_name} on {version}: {response.getcode()}")
            return True
    except Exception as e:
        print(f"Error testing {model_name} on {version}: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_gemini.py <api_key>")
        sys.exit(1)
    
    key = sys.argv[1]
    models = ["gemini-flash-latest", "gemini-2.0-flash-lite"]
    
    for m in models:
        test_model(key, m, "v1beta")
