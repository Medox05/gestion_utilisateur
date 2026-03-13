<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Site extends Model
{
    protected $table = 'sites';

    protected $fillable = [
        'nom',
    ];

    public $timestamps = false;

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(
            Utilisateur::class,
            'user_sites',
            'siteId',
            'userId'
        );
    }
}