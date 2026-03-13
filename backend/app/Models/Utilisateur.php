<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
class Utilisateur extends Model
{
    protected $table = 'users';
    protected $fillable = [
        'login',
        'nom',
        'prenom',
        'email',
        
        'typeAcces',
        'dateCreation',
    ];
    public $timestamps = false;
    
    public function sites(): BelongsToMany
    {
        return $this->belongsToMany(
            Site::class,
            'user_sites',
            'userId',
            'siteId'
        );
    }
}