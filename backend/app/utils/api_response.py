from typing import Any, Optional

def api_response(
    message: str = "Success",
    status_code: int = 200,
    data: Optional[Any] = None
) -> dict:
    response = {
        "status": status_code,
        "message": message,
        "success": status_code < 400
    }
    if data is not None:
        response["data"] = data
    return response
