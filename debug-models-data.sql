-- Check what's currently in the home_models_showcase table
SELECT * FROM home_models_showcase ORDER BY order_index;

-- Check the visibility setting
SELECT show_models_showcase_section FROM home_visibility WHERE id = 1;

-- Count how many models exist
SELECT COUNT(*) as total_models FROM home_models_showcase;
