from app.utils.keyword_match import match_keywords

def ats_score(resume_text: str, jd_text: str):
    matched, missing = match_keywords(resume_text, jd_text)
    score = round(len(matched) / (len(matched) + len(missing)) * 100, 2) if (matched or missing) else 0
    return {
        "score": score,
        "matched_keywords": matched,
        "missing_keywords": missing,
        "notes": "Improve missing keywords to boost ATS score."
    }
