import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PlayersService } from '../../../../../services/players.service';
import { Player, CreatePlayerDto } from '../../../../../core/models/player.model';

@Component({
    selector: 'app-players',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './players.component.html'
})
export class PlayersComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private playersService = inject(PlayersService);
    private fb = inject(FormBuilder);

    teamId = signal<number | null>(null);
    players = signal<Player[]>([]);
    isLoading = signal(false);
    showForm = signal(false);
    editingPlayer = signal<Player | null>(null);
    isSaving = signal(false);

    playerForm: FormGroup;

    // Computed signals
    activePlayers = computed(() => this.players().filter(p => p.isActive));
    inactivePlayers = computed(() => this.players().filter(p => !p.isActive));

    constructor() {
        this.playerForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.maxLength(100)]],
            lastName: ['', [Validators.required, Validators.maxLength(100)]],
            dateOfBirth: [''],
            email: ['', [Validators.email, Validators.maxLength(255)]],
            phone: ['', [Validators.maxLength(50)]]
        });
    }

    ngOnInit() {
        // Get teamId from parent route or query params
        this.route.parent?.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.teamId.set(+id);
                this.loadPlayers();
            }
        });
    }

    loadPlayers() {
        const teamId = this.teamId();
        if (!teamId) return;

        this.isLoading.set(true);
        this.playersService.getTeamPlayers(teamId).subscribe({
            next: (data) => {
                this.players.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading players', err);
                this.isLoading.set(false);
            }
        });
    }

    openForm(player?: Player) {
        if (player) {
            this.editingPlayer.set(player);
            this.playerForm.patchValue({
                firstName: player.firstName,
                lastName: player.lastName,
                dateOfBirth: player.dateOfBirth ? player.dateOfBirth.split('T')[0] : '',
                email: player.email || '',
                phone: player.phone || ''
            });
        } else {
            this.editingPlayer.set(null);
            this.playerForm.reset();
        }
        this.showForm.set(true);
    }

    closeForm() {
        this.showForm.set(false);
        this.editingPlayer.set(null);
        this.playerForm.reset();
    }

    savePlayer() {
        if (this.playerForm.invalid || !this.teamId()) return;

        this.isSaving.set(true);
        const formValue = this.playerForm.value;

        if (this.editingPlayer()) {
            // Update existing player
            const updateDto = {
                firstName: formValue.firstName,
                lastName: formValue.lastName,
                dateOfBirth: formValue.dateOfBirth || null,
                email: formValue.email || null,
                phone: formValue.phone || null,
                isActive: this.editingPlayer()!.isActive
            };

            this.playersService.updatePlayer(this.editingPlayer()!.id, updateDto).subscribe({
                next: () => {
                    this.loadPlayers();
                    this.closeForm();
                    this.isSaving.set(false);
                },
                error: (err) => {
                    console.error('Error updating player', err);
                    this.isSaving.set(false);
                }
            });
        } else {
            // Create new player
            const createDto: CreatePlayerDto = {
                firstName: formValue.firstName,
                lastName: formValue.lastName,
                dateOfBirth: formValue.dateOfBirth || null,
                email: formValue.email || null,
                phone: formValue.phone || null,
                teamId: this.teamId()!
            };

            this.playersService.createPlayer(createDto).subscribe({
                next: () => {
                    this.loadPlayers();
                    this.closeForm();
                    this.isSaving.set(false);
                },
                error: (err) => {
                    console.error('Error creating player', err);
                    this.isSaving.set(false);
                }
            });
        }
    }

    togglePlayerActive(player: Player) {
        this.playersService.toggleActive(player.id).subscribe({
            next: () => {
                this.loadPlayers();
            },
            error: (err) => {
                console.error('Error toggling player status', err);
            }
        });
    }

    deletePlayer(player: Player) {
        if (!confirm(`¿Estás seguro de que deseas eliminar a ${player.firstName} ${player.lastName}?`)) {
            return;
        }

        this.playersService.deletePlayer(player.id).subscribe({
            next: () => {
                this.loadPlayers();
            },
            error: (err) => {
                console.error('Error deleting player', err);
            }
        });
    }

    calculateAge(dateOfBirth: string | null): number | null {
        if (!dateOfBirth) return null;
        const today = new Date();
        const birth = new Date(dateOfBirth);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }
}
