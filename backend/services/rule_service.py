from services.rule_config import DOMAIN_RULES

def evaluate_rules(scene_data, context):
    rules = DOMAIN_RULES.get(context, None)
    
    violations = []
    risk_score = 0
    
    if not rules:
        return {
            "violations": violations,
            "risk_score": risk_score,
            "risk_level": "Low",
            "inspection_status": "Compliant"
        }
        
    people = scene_data.get("people", [])
    
    for person in people:
        person_id = person.get("id")
        
        # Check mandatory items
        for item in rules.get("mandatory", []):
            field_name = f"has_{item.replace(' ', '_')}"
            if not person.get(field_name, True):
                weight = rules["severity_weights"].get(item, 10)
                violations.append(f"Person {person_id} missing mandatory item: {item}")
                risk_score += weight
                
        # Check restricted items
        for item in rules.get("restricted", []):
            field_name = f"has_{item.replace(' ', '_')}"
            if person.get(field_name, False):
                weight = rules["severity_weights"].get(item, 10)
                violations.append(f"Person {person_id} has restricted item: {item}")
                risk_score += weight
                
    # Also check global scene detections for restricted items not associated with a person
    for item in rules.get("restricted", []):
        count_key = f"{item.replace(' ', '_')}s_detected"
        count = scene_data.get(count_key, 0)
        if count > 0:
            weight = rules["severity_weights"].get(item, 10)
            # Find if this was already counted by person association
            person_associated_count = sum(1 for p in people if p.get(f"has_{item.replace(' ', '_')}", False))
            unassociated_count = count - person_associated_count
            if unassociated_count > 0:
                violations.append(f"Detected {unassociated_count} unassociated restricted item(s): {item}")
                risk_score += (weight * unassociated_count)

    risk_level = classify_risk(risk_score)
    
    return {
        "violations": violations,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "inspection_status": "Non-Compliant" if len(violations) > 0 else "Compliant"
    }

def classify_risk(score):
    if score >= 30:
        return "High"
    elif score >= 10:
        return "Medium"
    return "Low"
