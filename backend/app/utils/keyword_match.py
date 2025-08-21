def match_keywords(resume_text: str, jd_text: str):
    jd_keywords = set(jd_text.lower().split())
    resume_words = set(resume_text.lower().split())

    matched = list(jd_keywords & resume_words)
    missing = list(jd_keywords - resume_words)

    return matched, missing
