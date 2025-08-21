def suggest_improvements(resume_text: str, target_role: str | None = None):
    tips = []
    lower = resume_text.lower()

    if "summary" not in lower:
        tips.append("Add a short career summary at the top.")
    if "projects" not in lower:
        tips.append("Include a projects section with impact-driven details.")
    if "skills" not in lower:
        tips.append("Add a dedicated skills section.")

    suggested_skills = []
    if target_role:
        role = target_role.lower()
        if "data" in role or "ml" in role:
            suggested_skills += ["Python", "SQL", "Pandas", "TensorFlow", "PyTorch"]
        elif "backend" in role:
            suggested_skills += ["FastAPI", "Django", "PostgreSQL", "Docker"]
        elif "frontend" in role:
            suggested_skills += ["React", "TypeScript", "Next.js"]

    return {
        "tips": tips,
        "suggested_skills": list(set(suggested_skills))
    }
