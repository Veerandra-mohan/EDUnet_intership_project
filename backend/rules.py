def evaluate_context(detections, context):
    persons = detections.get("persons", 0)
    phones = detections.get("phones", 0)

    violations = 0
    rule_description = ""

    if context == "classroom":
        violations = phones
        rule_description = "Mobile phone usage is restricted."

    elif context == "hospital":
        # Mask detection not added yet
        violations = 0
        rule_description = "Mask compliance required."

    elif context == "construction":
        # Helmet detection not added yet
        violations = 0
        rule_description = "Helmet required on site."

    compliance = 100
    if persons > 0:
        compliance = max(0, (persons - violations) / persons * 100)

    return {
        "context": context,
        "persons": persons,
        "phones": phones,
        "violations": int(violations),
        "compliance_rate": round(compliance, 1),
        "rule_applied": rule_description
    }
