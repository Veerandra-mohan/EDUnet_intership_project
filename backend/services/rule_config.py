# Domain Rules Configuration

DOMAIN_RULES = {
    "classroom": {
        "mandatory": [],
        "restricted": ["cell phone"],
        "monitor": ["person"],
        "severity_weights": {
            "cell phone": 10
        }
    },
    "construction": {
        "mandatory": ["helmet", "safety vest"],
        "restricted": [],
        "monitor": ["person"],
        "severity_weights": {
            "helmet": 30,
            "safety vest": 20
        }
    },
    "hospital": {
        "mandatory": ["mask"],
        "restricted": [],
        "monitor": ["person"],
        "severity_weights": {
            "mask": 25
        }
    }
}
