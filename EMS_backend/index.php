<?php



  

$body = json_decode(file_get_contents("php://input"), true);
$request_method = $_SERVER['REQUEST_METHOD'];
$route = $_GET['route'] ?? '';

// CORS HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight requests (for POST requests with JSON)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection
$host = 'localhost';
$db = 'ems';
$user = 'root';
$pass = 'root';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "DB connection failed: " . $e->getMessage()]);
    exit;
}

$route = trim($_GET['route'] ?? '');
$request_method = $_SERVER['REQUEST_METHOD'];


switch ($route) {
    case 'reminders':
        require_once 'reminders.php';
        handleReminders($pdo, $_SERVER['REQUEST_METHOD']);
        break;

        case 'login':
            require_once 'login.php';
            handleLogin($pdo, $request_method);
            break;
        case 'crops':
                require_once 'crops.php';
                handleCrops($pdo, $request_method);
                break;
         case 'field_capacity':
                    require_once 'field_capacity.php';
                    handleFieldCapacity($pdo, $request_method);
                    break;
        case 'yield_forecast':
                        require_once 'yield_forecast.php';
                        handleYieldForecast($pdo, $request_method);
                        break;
         case 'equipment_status':
                            require_once 'equipment_status.php';
                            handleEquipmentStatus($pdo, $request_method);
                            break;
            case 'users':
                                require_once 'users.php';
                                handleUsers($pdo, $_SERVER['REQUEST_METHOD']);
                                break;
                              
                                          
                  
              

    default:
        echo json_encode(["message" => "EMS Backend API running"]);
        break;

       
        
}
