import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConceptCategoriesService } from '../../../../services/concept-categories.service';
import { SportConceptService } from '../../../../services/sport-concept.service';

interface CategoryNode {
  id: number;
  name: string;
  subCategories: CategoryNode[];
  isOpen?: boolean;
  isActive?: boolean;
  level?: number;
  concepts: any[];
  isNewlyCreated?: boolean; // Flag to show delete button
}

@Component({
  selector: 'app-concept-creator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './concept-creator.component.html',
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class ConceptCreatorComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() conceptCreated = new EventEmitter<any>();

  @ViewChild('categoryInput') categoryInput!: ElementRef;
  @ViewChild('conceptInput') conceptInput!: ElementRef;

  categories: CategoryNode[] = [];
  loading = true;
  
  // Selection Context
  selectedCategory: CategoryNode | null = null;
  
  // Inline Creation States
  isCreatingCategory = false;
  newCategoryName = '';
  
  isCreatingConcept = false;
  newConceptName = '';
  newConceptDescription = '';
  newConceptLevel: number | null = null;
  
  // UI States for Concept Creation
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  
  constructor(
    private categoryService: ConceptCategoriesService,
    private conceptService: SportConceptService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (res: any[]) => {
        this.categories = this.buildHierarchy(res);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.loading = false;
      }
    });
  }

  // Convert flat list to tree if necessary, or just map if already nested
  private buildHierarchy(flatList: any[]): CategoryNode[] {
    const hasParentRefs = flatList.some(item => item.parentId != null);

    if (!hasParentRefs && flatList.length > 0 && flatList[0].subCategories && flatList[0].subCategories.length > 0) {
        return this.mapToNode(flatList); 
    }

    // Fallback: Build tree from flat list (ParentId)
    const map = new Map<number, CategoryNode>();
    const roots: CategoryNode[] = [];

    // 1. Initialize nodes
    flatList.forEach(item => {
      map.set(item.id, { 
        id: item.id, 
        name: item.name, 
        subCategories: [], 
        concepts: item.concepts || [],
        isOpen: false, 
        isActive: false 
      });
    });

    // 2. Link parents
    flatList.forEach(item => {
      const node = map.get(item.id)!;
      if (item.parentId) {
        const parent = map.get(item.parentId);
        if (parent) {
          parent.subCategories.push(node);
        } else {
            roots.push(node); // Orphan or root
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  private mapToNode(list: any[]): CategoryNode[] {
    return list.map(item => ({
        id: item.id,
        name: item.name,
        subCategories: item.subCategories ? this.mapToNode(item.subCategories) : [],
        concepts: item.concepts || [],
        isOpen: false,
        isActive: false
    }));
  }

  selectCategory(category: CategoryNode) {
    if (this.selectedCategory) {
        this.selectedCategory.isActive = false;
    }
    this.selectedCategory = category;
    this.selectedCategory.isActive = true;
    this.selectedCategory.isOpen = true;
    
    // Reset creation forms when changing context
    this.isCreatingCategory = false;
    this.isCreatingConcept = false;
    this.clearMessages();
  }

  toggleExpand(category: CategoryNode, event: Event) {
    event.stopPropagation();
    category.isOpen = !category.isOpen;
  }

  // --- ACTIONS ---

  startCreateCategory() {
    this.isCreatingCategory = true;
    this.newCategoryName = '';
    setTimeout(() => this.categoryInput?.nativeElement.focus(), 100);
  }

  saveCategory() {
    if (!this.newCategoryName.trim()) return;

    const payload = {
      name: this.newCategoryName,
      parentId: this.selectedCategory ? this.selectedCategory.id : null,
      description: ''
    };

    this.categoryService.create(payload).subscribe({
      next: (res: any) => {
        // Create the new category node
        const newNode: CategoryNode = {
          id: res.id,
          name: res.name,
          subCategories: [],
          concepts: [],
          isOpen: true,
          isActive: false,
          isNewlyCreated: true // Mark as newly created (shows delete button)
        };

        // Add to the tree locally (without full reload)
        if (this.selectedCategory) {
          // Add as child of selected category
          this.selectedCategory.subCategories.push(newNode);
          this.selectedCategory.isOpen = true; // Ensure parent is expanded
        } else {
          // Add as root category
          this.categories.push(newNode);
        }

        // Auto-select the new category for immediate feedback
        this.selectCategory(newNode);

        // Clear form and stay ready for next category
        this.newCategoryName = '';
        this.isCreatingCategory = false;
        
        // Show success feedback briefly
        console.log('✓ Categoría creada:', res.name);
      },
      error: (err) => console.error(err)
    });
  }

  startCreateConcept() {
    if (!this.selectedCategory) return;
    this.isCreatingConcept = true;
    this.newConceptName = '';
    this.newConceptDescription = '';
    this.newConceptLevel = null;
    this.clearMessages();
    setTimeout(() => this.conceptInput?.nativeElement.focus(), 100);
  }

  saveConcept() {
    // Clear previous messages
    this.clearMessages();

    // Validate
    if (!this.validateConcept()) {
      return;
    }

    // Build payload
    const payload = this.buildConceptPayload();
    
    // Set saving state
    this.isSaving = true;

    // Save to backend
    this.conceptService.create(payload).subscribe({
      next: (savedConcept: any) => {
        // Mark concept as newly created
        savedConcept.isNewlyCreated = true;
        
        // Update local category state
        if (this.selectedCategory) {
          // Check if concept already exists (avoid duplicates)
          const exists = this.selectedCategory.concepts.some(c => c.id === savedConcept.id);
          if (!exists) {
            this.selectedCategory.concepts.push(savedConcept);
            // Ensure category is expanded to show the new concept
            this.selectedCategory.isOpen = true;
          }
        }
        
        // Emit to parent with REAL saved concept (positive ID)
        this.conceptCreated.emit(savedConcept);
        
        // Show success feedback
        this.showSuccessFeedback();
        
        // Reset form for rapid creation
        this.resetForm();
        
        // Re-focus for next concept
        setTimeout(() => this.conceptInput?.nativeElement.focus(), 50);
      },
      error: (err) => {
        console.error('Error creating concept:', err);
        this.showErrorFeedback(err);
        this.isSaving = false;
      }
    });
  }

  // --- VALIDATION ---

  private validateConcept(): boolean {
    if (!this.newConceptName.trim()) {
      this.errorMessage = 'El nombre del concepto es obligatorio';
      return false;
    }

    if (this.newConceptName.length < 3) {
      this.errorMessage = 'El nombre debe tener al menos 3 caracteres';
      return false;
    }

    if (this.newConceptName.length > 100) {
      this.errorMessage = 'El nombre no puede exceder 100 caracteres';
      return false;
    }

    if (!this.selectedCategory) {
      this.errorMessage = 'Debes seleccionar una categoría';
      return false;
    }

    if (this.newConceptDescription && this.newConceptDescription.length > 500) {
      this.errorMessage = 'La descripción no puede exceder 500 caracteres';
      return false;
    }

    if (!this.newConceptLevel || this.newConceptLevel < 1 || this.newConceptLevel > 5) {
      this.errorMessage = 'Debes seleccionar un nivel entre 1 y 5';
      return false;
    }

    return true;
  }

  // --- PAYLOAD BUILDER ---

  private buildConceptPayload(): any {
    return {
      name: this.newConceptName.trim(),
      description: this.newConceptDescription.trim() || null,
      conceptCategoryId: this.selectedCategory!.id,
      developmentLevel: this.newConceptLevel,
      technicalDifficulty: 5,
      tacticalComplexity: 5,
      progressWeight: 50,
      isProgressive: true
      // sportId will be auto-assigned by backend based on user subscription
    };
  }

  // --- FEEDBACK ---

  private showSuccessFeedback() {
    this.successMessage = '✓ Concepto guardado correctamente';
    setTimeout(() => {
      this.successMessage = '';
    }, 2000);
  }

  private showErrorFeedback(err: any) {
    if (err.error && typeof err.error === 'string') {
      this.errorMessage = err.error;
    } else if (err.error && err.error.message) {
      this.errorMessage = err.error.message;
    } else if (err.status === 0) {
      this.errorMessage = 'Error de conexión. Verifica que el servidor esté activo.';
    } else if (err.status === 400) {
      this.errorMessage = 'Datos inválidos. Verifica los campos.';
    } else {
      this.errorMessage = 'Error al guardar el concepto. Inténtalo de nuevo.';
    }
  }

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // --- FORM RESET ---

  private resetForm() {
    this.newConceptName = '';
    this.newConceptDescription = '';
    this.newConceptLevel = null;
    this.isSaving = false;
  }

  // --- DELETE METHODS ---

  deleteCategory(category: CategoryNode, event: Event) {
    event.stopPropagation();
    
    if (!confirm(`¿Eliminar la categoría "${category.name}"?`)) {
      return;
    }

    // Delete from backend
    this.categoryService.delete(category.id).subscribe({
      next: () => {
        // Remove from tree locally
        this.removeCategoryFromTree(category.id);
        
        // If it was selected, clear selection
        if (this.selectedCategory?.id === category.id) {
          this.selectedCategory = null;
        }
        
        console.log('✓ Categoría eliminada:', category.name);
      },
      error: (err) => {
        console.error('Error deleting category:', err);
        alert('Error al eliminar la categoría');
      }
    });
  }

  private removeCategoryFromTree(categoryId: number) {
    // Recursive function to find and remove category
    const removeFromArray = (nodes: CategoryNode[]): boolean => {
      const index = nodes.findIndex(n => n.id === categoryId);
      if (index !== -1) {
        nodes.splice(index, 1);
        return true;
      }
      
      // Search in children
      for (const node of nodes) {
        if (removeFromArray(node.subCategories)) {
          return true;
        }
      }
      return false;
    };
    
    removeFromArray(this.categories);
  }

  deleteConcept(category: CategoryNode, concept: any, event: Event) {
    event.stopPropagation();
    
    if (!confirm(`¿Eliminar el concepto "${concept.name}"?`)) {
      return;
    }

    // Delete from backend
    this.conceptService.delete(concept.id).subscribe({
      next: () => {
        // Remove from local array
        const index = category.concepts.indexOf(concept);
        if (index !== -1) {
          category.concepts.splice(index, 1);
        }
        
        console.log('✓ Concepto eliminado:', concept.name);
      },
      error: (err) => {
        console.error('Error deleting concept:', err);
        alert('Error al eliminar el concepto');
      }
    });
  }
}

