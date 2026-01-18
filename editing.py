import csv
import sys

def fill_missing_values(input_file, output_file):
    # Columns to check for empty values
    target_fields = ['location', 'minutes', 'room', 'proctor1', 'proctor2']
    
    with open(input_file, mode='r', newline='', encoding='utf-8') as infile, \
         open(output_file, mode='w', newline='', encoding='utf-8') as outfile:
        
        reader = csv.DictReader(infile)
        fieldnames = reader.fieldnames
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        
        writer.writeheader()
        
        # Store the previous row's values
        last_values = {field: '' for field in target_fields}
        
        for row in reader:
            for field in target_fields:
                if field in row:
                    value = row[field].strip()
                    
                    if not value:
                        # If empty, fill with last known value
                        row[field] = last_values[field]
                    else:
                        # If not empty, update the last known value
                        last_values[field] = value
            
            writer.writerow(row)

if __name__ == "__main__":
    # Example usage: python editing.py input.csv output.csv
    if len(sys.argv) != 3:
        print("Usage: python editing.py <input_csv> <output_csv>")
    else:
        fill_missing_values(sys.argv[1], sys.argv[2])