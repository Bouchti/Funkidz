from decimal import Decimal

def calculate_estimated_price(service, options_with_quantities, children_count, duration_minutes):
    """
    Calculates the total estimated price for a booking.
    
    Args:
        service: The Service model instance.
        options_with_quantities: List of tuples (Option instance, quantity).
        children_count: Number of children.
        duration_minutes: Duration of the event in minutes.
    """
    total = Decimal(str(service.base_price))
    
    for option, quantity in options_with_quantities:
        price = Decimal(str(option.price))
        qty = Decimal(str(quantity))
        
        if option.pricing_type == 'FIXED':
            total += price * qty
        elif option.pricing_type == 'PER_CHILD':
            total += price * Decimal(str(children_count)) * qty
        elif option.pricing_type == 'PER_HOUR':
            hours = Decimal(str(duration_minutes)) / Decimal('60')
            total += price * hours * qty
            
    return total.quantize(Decimal('0.01'))
