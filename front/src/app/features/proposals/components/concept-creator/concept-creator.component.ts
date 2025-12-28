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
  // Assuming the API returns a flat list based on previous file inspection (no explicit subCategories in DTO used in service?)
  // Actually the model had SubCategories. Let's assume the API might return flat or nested. 
  // Safety check: if flat, build tree.
  private buildHierarchy(flatList: any[]): CategoryNode[] {
    // Check if we are dealing with a flat list that has parent references
    // If ANY item has a parentId, we MUST rebuild the tree manually to avoid duplication
    // (because the API might return both the Parent with nested children AND the Children as top-level items)
    const hasParentRefs = flatList.some(item => item.parentId != null);

    // Only use direct mapping if it's purely a nested tree (no parentIds indicating flat structure)
    // AND it has structure
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
      next: (res) => {
        this.loadCategories(); 
        // Rapid Fire: Don't close, just clear and focus
        this.newCategoryName = '';
        setTimeout(() => this.categoryInput?.nativeElement.focus(), 50);
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
    setTimeout(() => this.conceptInput?.nativeElement.focus(), 100);
  }

  saveConcept() {
    if (!this.newConceptName.trim() || !this.selectedCategory) return;

    const payload = {
        name: this.newConceptName,
        description: this.newConceptDescription,
        conceptCategoryId: this.selectedCategory.id,
        developmentLevel: this.newConceptLevel || 1, // Default to level 1
        technicalDifficulty: 5, // Defaults
        tacticalComplexity: 5
    };

    this.conceptService.create(payload).subscribe({
        next: (res) => {
            this.conceptCreated.emit(res);
            // Rapid Fire: Reset fields but keep creating
            this.newConceptName = '';
            this.newConceptDescription = '';
            setTimeout(() => this.conceptInput?.nativeElement.focus(), 50);
        },
        error: (err) => console.error(err)
    });
  }
}
