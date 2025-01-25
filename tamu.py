import os
from phoenix.otel import register

# Add Phoenix API Key for tracing
PHOENIX_API_KEY = "772295f1fac643625dd:c7bdae5"
os.environ["PHOENIX_CLIENT_HEADERS"] = f"api_key={PHOENIX_API_KEY}"
os.environ["PHOENIX_COLLECTOR_ENDPOINT"] = "https://app.phoenix.arize.com"

# configure the Phoenix tracer
tracer_provider = register() 