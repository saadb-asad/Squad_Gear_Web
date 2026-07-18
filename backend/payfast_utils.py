import hashlib
import urllib.parse
import os
import httpx
from dotenv import load_dotenv

load_dotenv(override=True)

PAYFAST_MERCHANT_ID = os.getenv("PAYFAST_MERCHANT_ID")
PAYFAST_MERCHANT_KEY = os.getenv("PAYFAST_MERCHANT_KEY")
PAYFAST_PASSPHRASE = os.getenv("PAYFAST_PASSPHRASE", "")
PAYFAST_URL = os.getenv("PAYFAST_URL")
PAYFAST_VALIDATION_URL = os.getenv("PAYFAST_VALIDATION_URL")

def generate_signature(data: dict) -> str:
    """
    Generate Payfast MD5 signature.
    1. Sort keys alphabetically.
    2. URL-encode key=value combinations.
    3. Join with '&'.
    4. If passphrase exists, append '&passphrase=<url_encoded_passphrase>'.
    5. MD5 hash the resulting string.
    """
    sorted_keys = sorted(data.keys())
    pf_string_parts = []
    
    for key in sorted_keys:
        if key != "signature" and data[key] is not None and data[key] != "":
            # Payfast uses standard URL encoding
            val = str(data[key]).strip()
            encoded_key = urllib.parse.quote_plus(key)
            encoded_val = urllib.parse.quote_plus(val)
            pf_string_parts.append(f"{encoded_key}={encoded_val}")
            
    pf_string = "&".join(pf_string_parts)
    
    if PAYFAST_PASSPHRASE:
        pf_string += f"&passphrase={urllib.parse.quote_plus(PAYFAST_PASSPHRASE)}"
        
    return hashlib.md5(pf_string.encode()).hexdigest()

async def validate_itn(data: dict) -> bool:
    """
    Validates the Instant Transaction Notification (ITN) from Payfast.
    """
    # 1. Validate signature locally
    if data.get('signature') != generate_signature(data):
        return False
        
    # 2. Check if payment is successful
    if data.get('payment_status') != "COMPLETE":
        return False
        
    # 3. Call Payfast Validation URL to confirm it's from them
    pf_param_string = "&".join(
        [f"{urllib.parse.quote_plus(k)}={urllib.parse.quote_plus(str(v))}" for k, v in data.items()]
    )
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                PAYFAST_VALIDATION_URL,
                content=pf_param_string,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            if response.text.strip() != "VALID":
                return False
    except Exception:
        return False
        
    return True
