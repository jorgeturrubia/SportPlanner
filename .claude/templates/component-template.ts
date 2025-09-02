import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-[COMPONENT_NAME]',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './[COMPONENT_NAME].component.html',
  styleUrl: './[COMPONENT_NAME].component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class [COMPONENT_CLASS]Component implements OnInit {
  // Services
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);
  
  // Signals for reactive state
  data = signal<[DATA_TYPE][]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  
  // Computed properties
  hasData = computed(() => this.data().length > 0);
  
  // Form
  form: FormGroup = this.fb.group({
    // Define form controls here
    name: ['', [Validators.required, Validators.minLength(3)]],
  });

  ngOnInit(): void {
    this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set(null);
      
      // Load data logic here
      // const data = await this.dataService.getData();
      // this.data.set(data);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      this.error.set(errorMessage);
      this.notificationService.showError(errorMessage);
    } finally {
      this.isLoading.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      this.isLoading.set(true);
      const formValue = this.form.value;
      
      // Submit logic here
      // await this.dataService.create(formValue);
      
      this.notificationService.showSuccess('[ENTITY] created successfully!');
      this.form.reset();
      await this.loadData(); // Refresh data
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create [ENTITY]';
      this.notificationService.showError(errorMessage);
    } finally {
      this.isLoading.set(false);
    }
  }

  async onDelete(id: string): Promise<void> {
    if (!confirm('Are you sure you want to delete this [ENTITY]?')) {
      return;
    }

    try {
      this.isLoading.set(true);
      
      // Delete logic here
      // await this.dataService.delete(id);
      
      this.notificationService.showSuccess('[ENTITY] deleted successfully!');
      await this.loadData(); // Refresh data
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete [ENTITY]';
      this.notificationService.showError(errorMessage);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Helper methods for template
  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${fieldName} is required`;
      if (control.errors['minlength']) return `${fieldName} must be at least ${control.errors['minlength'].requiredLength} characters`;
      if (control.errors['email']) return 'Please enter a valid email';
    }
    return '';
  }
}

/* 
USAGE INSTRUCTIONS:
1. Replace [COMPONENT_NAME] with kebab-case component name (e.g., 'team-list')
2. Replace [COMPONENT_CLASS] with PascalCase class name (e.g., 'TeamList')
3. Replace [DATA_TYPE] with the appropriate data type (e.g., 'Team')
4. Replace [ENTITY] with entity name for user messages (e.g., 'Team')
5. Implement actual service calls and data handling
6. Create corresponding HTML and CSS files
7. Update imports and dependencies as needed

ANGULAR 20+ PATTERNS INCLUDED:
- Standalone component
- Signals for reactive state
- Computed properties
- inject() function instead of constructor injection
- OnPush change detection strategy
- Reactive forms with validation
- Error handling with notifications
- Async/await patterns
- Type safety throughout
*/