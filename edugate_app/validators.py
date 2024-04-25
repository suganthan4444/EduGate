from django.core.exceptions import ValidationError
import re

class CustomPasswordValidator:
    def validate(self, password):
        # Define password rules
        min_length = 8
        has_uppercase = re.search(r'[A-Z]', password)
        has_lowercase = re.search(r'[a-z]', password)
        has_number = re.search(r'[0-9]', password)
        has_special_char = re.search(r'[!@#$%^&*(),.?":{}|<>]', password)
        
        # Check if password meets the rules
        if len(password) < min_length:
            raise ValidationError('Password must be at least 8 characters long.')
        if not has_uppercase:
            raise ValidationError('Password must contain at least one uppercase letter.')
        if not has_lowercase:
            raise ValidationError('Password must contain at least one lowercase letter.')
        if not has_number:
            raise ValidationError('Password must contain at least one number.')
        if not has_special_char:
            raise ValidationError('Password must contain at least one special character.')

    def get_help_text(self):
        return "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
