-- Check if the home_models_showcase table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'home_models_showcase'
);

-- If it exists, show all records
SELECT * FROM home_models_showcase ORDER BY order_index;

-- Check if home_visibility has the column
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'home_visibility' 
AND column_name = 'show_models_showcase_section';
