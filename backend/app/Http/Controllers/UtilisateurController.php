<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use App\Models\Site;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UtilisateurController extends Controller
{
    public function index()
    {
        return Utilisateur::with('sites')
            ->orderBy('id', 'desc')
            ->get();
    }

    public function sites()
    {
        return Site::orderBy('id', 'asc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:50',
            'prenom' => 'required|string|max:50',
            'email' => 'required|email|max:100|unique:users,email',
            'globalAccess' => 'required|boolean',
            'sites' => 'array',
            'sites.*' => 'integer|exists:sites,id',
        ]);

        if ($validated['globalAccess'] === false && empty($validated['sites'])) {
            return response()->json([
                'message' => 'Choisissez au moins un site pour un accès restreint'
            ], 422);
        }

        $user = DB::transaction(function () use ($validated) {
            $user = Utilisateur::create([
                'login' => $validated['email'],
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'email' => $validated['email'],
                'typeAcces' => $validated['globalAccess'] ? 'GLOBAL' : 'RESTRICTED',
                'dateCreation' => now(),
            ]);

            $siteIds = $validated['globalAccess'] ? [] : ($validated['sites'] ?? []);
            $user->sites()->sync($siteIds);

            return $user->load('sites');
        });

        return response()->json($user, 201);
    }

    public function update(Request $request, $id)
    {
        $user = Utilisateur::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'required|string|max:50',
            'prenom' => 'required|string|max:50',
            'email' => 'required|email|max:100|unique:users,email,' . $id,
            'globalAccess' => 'required|boolean',
            'sites' => 'array',
            'sites.*' => 'integer|exists:sites,id',
        ]);

        if ($validated['globalAccess'] === false && empty($validated['sites'])) {
            return response()->json([
                'message' => 'Choisissez au moins un site pour un accès restreint'
            ], 422);
        }

        $user = DB::transaction(function () use ($validated, $user) {
            $user->update([
                'login' => $validated['email'],
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'email' => $validated['email'],
                'typeAcces' => $validated['globalAccess'] ? 'GLOBAL' : 'RESTRICTED',
            ]);

            $siteIds = $validated['globalAccess'] ? [] : ($validated['sites'] ?? []);
            $user->sites()->sync($siteIds);

            return $user->load('sites');
        });

        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = Utilisateur::findOrFail($id);

        DB::transaction(function () use ($user) {
            $user->sites()->detach();
            $user->delete();
        });

        return response()->json([
            'message' => 'deleted'
        ]);
    }
}