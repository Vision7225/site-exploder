def generate_suggestion(stress):
    if stress > 70:
        return "High stress detected. Try meditation 🧘"
    elif stress > 40:
        return "Moderate stress. Take a short break ☕"
    else:
        return "You are doing great 😊"