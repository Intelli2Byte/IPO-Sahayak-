from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

def with_retry(exceptions=(Exception,), attempts=3):
    return retry(
        reraise=True,
        stop=stop_after_attempt(attempts),
        wait=wait_exponential(multiplier=1, min=2, max=20),
        retry=retry_if_exception_type(exceptions),
    )