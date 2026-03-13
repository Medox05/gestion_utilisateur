<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

function db_connect()
{
    return sqlsrv_connect(env('DB_HOST', 'MEDOX'), [
        "Database" => env('DB_DATABASE', 'gestion_utilisateurs'),
        "UID" => env('DB_USERNAME', 'app_user'),
        "PWD" => env('DB_PASSWORD', 'StrongPass123!'),
        "CharacterSet" => "UTF-8",
        "TrustServerCertificate" => true,
        "Encrypt" => false,
    ]);
}

function sql_error_response($defaultMessage = 'SQL error', $status = 500)
{
    $errors = sqlsrv_errors();
    $message = $defaultMessage;

    if (!empty($errors) && isset($errors[0]['message'])) {
        $message = $errors[0]['message'];
    }

    return response()->json([
        'message' => $message,
        'errors' => $errors,
    ], $status);
}

function make_login($nom, $prenom)
{
    $nom = trim(mb_strtolower($nom));
    $prenom = trim(mb_strtolower($prenom));

    $replace = [
        'à' => 'a', 'á' => 'a', 'â' => 'a', 'ä' => 'a',
        'ç' => 'c',
        'è' => 'e', 'é' => 'e', 'ê' => 'e', 'ë' => 'e',
        'ì' => 'i', 'í' => 'i', 'î' => 'i', 'ï' => 'i',
        'ñ' => 'n',
        'ò' => 'o', 'ó' => 'o', 'ô' => 'o', 'ö' => 'o',
        'ù' => 'u', 'ú' => 'u', 'û' => 'u', 'ü' => 'u',
        'ý' => 'y', 'ÿ' => 'y',
        ' ' => '', '-' => '', "'" => ""
    ];

    $nom = strtr($nom, $replace);
    $prenom = strtr($prenom, $replace);

    return $nom . '.' . $prenom;
}

/*
| GET SITES : Afficher tous les sites
*/
Route::get('/sites', function () {
    $conn = db_connect();

    if (!$conn) {
        return sql_error_response('Connection failed');
    }

    $stmt = sqlsrv_query($conn, "SELECT id, code, nom FROM sites ORDER BY id ASC");

    if ($stmt === false) {
        sqlsrv_close($conn);
        return sql_error_response('Query sites failed');
    }

    $sites = [];

    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        $sites[] = [
            'id' => (int) $row['id'],
            'code' => $row['code'] ?? '',
            'nom' => $row['nom'],
        ];
    }

    sqlsrv_free_stmt($stmt);
    sqlsrv_close($conn);

    return response()->json($sites);
});

/*
GET USERS :Afficher tous les utilisateurs
*/
Route::get('/users', function () {
    $conn = db_connect();

    if (!$conn) {
        return sql_error_response('Connection failed');
    }

    $sql = "
        SELECT
            u.id,
            u.login,
            u.nom,
            u.prenom,
            u.email,
            
            u.typeAcces,
            u.dateCreation,
            s.id AS site_id,
            s.code AS site_code,
            s.nom AS site_nom
        FROM users u
        LEFT JOIN user_sites us ON us.userId = u.id
        LEFT JOIN sites s ON s.id = us.siteId
        ORDER BY u.id DESC
    ";

    $stmt = sqlsrv_query($conn, $sql);

    if ($stmt === false) {
        sqlsrv_close($conn);
        return sql_error_response('Query users failed');
    }

    $users = [];

    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        $id = (int) $row['id'];

        if (!isset($users[$id])) {
            $dateCreation = $row['dateCreation'];
            if ($dateCreation instanceof DateTime) {
                $dateCreation = $dateCreation->format('Y-m-d H:i:s');
            }

            $users[$id] = [
                'id' => $id,
                'login' => $row['login'],
                'nom' => $row['nom'],
                'prenom' => $row['prenom'],
                'email' => $row['email'],
                
                'typeAcces' => $row['typeAcces'],
                'dateCreation' => $dateCreation,
                'sites' => [],
            ];
        }

        if ($row['site_id'] !== null) {
            $users[$id]['sites'][] = [
                'id' => (int) $row['site_id'],
                'code' => $row['site_code'] ?? '',
                'nom' => $row['site_nom'],
            ];
        }
    }

    sqlsrv_free_stmt($stmt);
    sqlsrv_close($conn);

    return response()->json(array_values($users));
});

/*
GET USERS :Afficher tous les utilisateurs avec id 
*/
Route::get('/users/{id}', function ($id) {
    $conn = db_connect();

    if (!$conn) {
        return sql_error_response('Connection failed');
    }

    $sql = "
        SELECT
            u.id,
            u.login,
            u.nom,
            u.prenom,
            u.email,
            u.typeAcces,
            u.dateCreation,
            s.id AS site_id,
            s.code AS site_code,
            s.nom AS site_nom
        FROM users u
        LEFT JOIN user_sites us ON us.userId = u.id
        LEFT JOIN sites s ON s.id = us.siteId
        WHERE u.id = ?
    ";

    $stmt = sqlsrv_query($conn, $sql, [(int) $id]);

    if ($stmt === false) {
        sqlsrv_close($conn);
        return sql_error_response('Query user failed');
    }

    $user = null;

    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        if ($user === null) {
            $dateCreation = $row['dateCreation'];
            if ($dateCreation instanceof DateTime) {
                $dateCreation = $dateCreation->format('Y-m-d H:i:s');
            }

            $user = [
                'id' => (int) $row['id'],
                'login' => $row['login'],
                'nom' => $row['nom'],
                'prenom' => $row['prenom'],
                'email' => $row['email'],
                
                'typeAcces' => $row['typeAcces'],
                'dateCreation' => $dateCreation,
                'sites' => [],
            ];
        }

        if ($row['site_id'] !== null) {
            $user['sites'][] = [
                'id' => (int) $row['site_id'],
                'code' => $row['site_code'] ?? '',
                'nom' => $row['site_nom'],
            ];
        }
    }

    sqlsrv_free_stmt($stmt);
    sqlsrv_close($conn);

    if (!$user) {
      return response()->json(['message' => 'Utilisateur introuvable'], 404);
    }

    return response()->json($user);
});

/*
POST USERS :creer 1 utilisateur
*/
Route::post('/users', function (Request $request) {
    $data = $request->all();

    $globalAccess = filter_var($data['globalAccess'] ?? false, FILTER_VALIDATE_BOOLEAN);
    $sites = $data['sites'] ?? [];

    $validated = $request->validate([
        'nom' => 'required|string|max:50',
        'prenom' => 'required|string|max:50',
        'email' => 'required|email|max:100',
        'globalAccess' => 'required|boolean',
        'sites' => 'array',
    ]);

    $conn = db_connect();

    if (!$conn) {
        return sql_error_response('Connection failed');
    }

    if ($globalAccess === false && empty($sites)) {
        sqlsrv_close($conn);
        return response()->json([
            'message' => 'Choisissez au moins un site'
        ], 422);
    }

    $checkStmt = sqlsrv_query(
        $conn,
        "SELECT COUNT(*) AS total FROM users WHERE email = ?",
        [$validated['email']]
    );

    if ($checkStmt === false) {
        sqlsrv_close($conn);
        return sql_error_response('Email check failed');
    }

    $checkRow = sqlsrv_fetch_array($checkStmt, SQLSRV_FETCH_ASSOC);

    if ((int) $checkRow['total'] > 0) {
        sqlsrv_free_stmt($checkStmt);
        sqlsrv_close($conn);

        return response()->json([
            'message' => 'Email already exists'
        ], 422);
    }

    sqlsrv_free_stmt($checkStmt);

    $typeAcces = $globalAccess ? 'GLOBAL' : 'RESTREINT';
    $login = make_login($validated['nom'], $validated['prenom']);

    if (!sqlsrv_begin_transaction($conn)) {
        sqlsrv_close($conn);
        return sql_error_response('Transaction start failed');
    }

    try {
        $insertUserSql = "
            INSERT INTO users (login, email, prenom, nom, typeAcces, dateCreation)
            OUTPUT INSERTED.id
            VALUES (?, ?, ?, ?, ?, GETDATE())
        ";

        $insertStmt = sqlsrv_query($conn, $insertUserSql, [
            $login,
            $validated['email'],
            $validated['prenom'],
            $validated['nom'],
            
            $typeAcces
        ]);

        if ($insertStmt === false) {
            $errors = sqlsrv_errors();
            $msg = 'Insert user failed';

            if (!empty($errors) && isset($errors[0]['message'])) {
                $msg = $errors[0]['message'];
            }

            throw new \Exception($msg);
        }

        $inserted = sqlsrv_fetch_array($insertStmt, SQLSRV_FETCH_ASSOC);

        if (!$inserted || !isset($inserted['id'])) {
            throw new \Exception("Impossible de récupérer l'id inséré");
        }

        $userId = (int) $inserted['id'];
        sqlsrv_free_stmt($insertStmt);

        if (!$globalAccess) {
            foreach ($sites as $siteId) {
                $pivotStmt = sqlsrv_query(
                    $conn,
                    "INSERT INTO user_sites (userId, siteId) VALUES (?, ?)",
                    [$userId, (int) $siteId]
                );

                if ($pivotStmt === false) {
                    $errors = sqlsrv_errors();
                    $msg = 'Insert user_sites failed';

                    if (!empty($errors) && isset($errors[0]['message'])) {
                        $msg = $errors[0]['message'];
                    }

                    throw new \Exception($msg);
                }

                sqlsrv_free_stmt($pivotStmt);
            }
        }

        if (!sqlsrv_commit($conn)) {
            throw new \Exception('Commit failed');
        }

        sqlsrv_close($conn);

        return response()->json([
            'message' => 'User created',
            'id' => $userId
        ], 201);

    } catch (\Throwable $e) {
        sqlsrv_rollback($conn);
        $errors = sqlsrv_errors();
        sqlsrv_close($conn);

        $message = $e->getMessage();
        if (!empty($errors) && isset($errors[0]['message'])) {
            $message = $errors[0]['message'];
        }

        return response()->json([
            'message' => $message,
            'errors' => $errors,
        ], 500);
    }
});

/*
PUT USERS :Modifie 1 utilisateur
*/
Route::put('/users/{id}', function (Request $request, $id) {
    $data = $request->all();

    $globalAccess = filter_var($data['globalAccess'] ?? false, FILTER_VALIDATE_BOOLEAN);
    $sites = $data['sites'] ?? [];

    $validated = $request->validate([
        'nom' => 'required|string|max:50',
        'prenom' => 'required|string|max:50',
        'email' => 'required|email|max:100',
        'globalAccess' => 'required|boolean',
        'sites' => 'array',
    ]);

    $conn = db_connect();

    if (!$conn) {
        return sql_error_response('Connection failed');
    }

    if ($globalAccess === false && empty($sites)) {
        sqlsrv_close($conn);
        return response()->json([
            'message' => 'Choisissez au moins un site'
        ], 422);
    }

    $checkStmt = sqlsrv_query(
        $conn,
        "SELECT COUNT(*) AS total FROM users WHERE email = ? AND id <> ?",
        [$validated['email'], (int) $id]
    );

    if ($checkStmt === false) {
        sqlsrv_close($conn);
        return sql_error_response('Email check failed');
    }

    $checkRow = sqlsrv_fetch_array($checkStmt, SQLSRV_FETCH_ASSOC);

    if ((int) $checkRow['total'] > 0) {
        sqlsrv_free_stmt($checkStmt);
        sqlsrv_close($conn);

        return response()->json([
            'message' => 'Email already exists'
        ], 422);
    }

    sqlsrv_free_stmt($checkStmt);

    $typeAcces = $globalAccess ? 'GLOBAL' : 'RESTREINT';
    $login = make_login($validated['nom'], $validated['prenom']);

    if (!sqlsrv_begin_transaction($conn)) {
        sqlsrv_close($conn);
        return sql_error_response('Transaction start failed');
    }

    try {
        $updateStmt = sqlsrv_query(
            $conn,
            "UPDATE users
             SET login = ?, nom = ?, prenom = ?, email = ?, typeAcces = ?
             WHERE id = ?",
            [
                $login,
                $validated['nom'],
                $validated['prenom'],
                $validated['email'],
                $typeAcces,
                (int) $id
            ]
        );

        if ($updateStmt === false) {
            throw new \Exception('Update user failed');
        }

        sqlsrv_free_stmt($updateStmt);

        $deletePivotStmt = sqlsrv_query(
            $conn,
            "DELETE FROM user_sites WHERE userId = ?",
            [(int) $id]
        );

        if ($deletePivotStmt === false) {
            throw new \Exception('Delete old user_sites failed');
        }

        sqlsrv_free_stmt($deletePivotStmt);

        if (!$globalAccess) {
            foreach ($sites as $siteId) {
                $pivotStmt = sqlsrv_query(
                    $conn,
                    "INSERT INTO user_sites (userId, siteId) VALUES (?, ?)",
                    [(int) $id, (int) $siteId]
                );

                if ($pivotStmt === false) {
                    $errors = sqlsrv_errors();
                    $msg = 'Insert updated user_sites failed';

                    if (!empty($errors) && isset($errors[0]['message'])) {
                        $msg = $errors[0]['message'];
                    }

                    throw new \Exception($msg);
                }

                sqlsrv_free_stmt($pivotStmt);
            }
        }

        if (!sqlsrv_commit($conn)) {
            throw new \Exception('Commit failed');
        }

        sqlsrv_close($conn);

        return response()->json([
            'message' => 'User updated'
        ]);

    } catch (\Throwable $e) {
        sqlsrv_rollback($conn);
        $errors = sqlsrv_errors();
        sqlsrv_close($conn);

        $message = $e->getMessage();
        if (!empty($errors) && isset($errors[0]['message'])) {
            $message = $errors[0]['message'];
        }

        return response()->json([
            'message' => $message,
            'errors' => $errors,
        ], 500);
    }
});

/*
DELETE USERS :suprimmer 1 utilisateur
*/
Route::delete('/users/{id}', function ($id) {
    $conn = db_connect();

    if (!$conn) {
        return sql_error_response('Connection failed');
    }

    if (!sqlsrv_begin_transaction($conn)) {
        sqlsrv_close($conn);
        return sql_error_response('Transaction start failed');
    }

    try {
        $stmt1 = sqlsrv_query(
            $conn,
            "DELETE FROM user_sites WHERE userId = ?",
            [(int) $id]
        );

        if ($stmt1 === false) {
            throw new \Exception('Delete user_sites failed');
        }

        sqlsrv_free_stmt($stmt1);

        $stmt2 = sqlsrv_query(
            $conn,
            "DELETE FROM users WHERE id = ?",
            [(int) $id]
        );

        if ($stmt2 === false) {
            throw new \Exception('Delete user failed');
        }

        sqlsrv_free_stmt($stmt2);

        if (!sqlsrv_commit($conn)) {
            throw new \Exception('Commit failed');
        }

        sqlsrv_close($conn);

        return response()->json([
            'message' => 'User deleted'
        ]);

    } catch (\Throwable $e) {
        sqlsrv_rollback($conn);
        $errors = sqlsrv_errors();
        sqlsrv_close($conn);

        $message = $e->getMessage();
        if (!empty($errors) && isset($errors[0]['message'])) {
            $message = $errors[0]['message'];
        }

        return response()->json([
            'message' => $message,
            'errors' => $errors,
        ], 500);
    }
});