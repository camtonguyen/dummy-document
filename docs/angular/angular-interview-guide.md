# Comprehensive Angular Interview Guide

## Table of Contents

1. [Angular Fundamentals](#1-angular-fundamentals)
2. [Components](#2-components)
3. [Templates & Data Binding](#3-templates--data-binding)
4. [Directives](#4-directives)
5. [Pipes](#5-pipes)
6. [Services & Dependency Injection](#6-services--dependency-injection)
7. [Modules](#7-modules)
8. [Routing & Navigation](#8-routing--navigation)
9. [Forms](#9-forms)
10. [HTTP & API Communication](#10-http--api-communication)
11. [RxJS & Observables](#11-rxjs--observables)
12. [Lifecycle Hooks](#12-lifecycle-hooks)
13. [Change Detection](#13-change-detection)
14. [State Management](#14-state-management)
15. [Testing](#15-testing)
16. [Performance Optimization](#16-performance-optimization)
17. [Angular Signals](#17-angular-signals)
18. [Standalone Components](#18-standalone-components)
19. [Security](#19-security)
20. [Advanced Concepts](#20-advanced-concepts)

---

## 1. Angular Fundamentals

### What is Angular?

Angular is a TypeScript-based open-source web application framework developed by Google. It's a complete rewrite of AngularJS and provides a comprehensive solution for building scalable single-page applications (SPAs) with features like two-way data binding, dependency injection, modular architecture, and a powerful CLI.

### Key Differences: Angular vs AngularJS

| Feature              | AngularJS (1.x)     | Angular (2+)             |
| -------------------- | ------------------- | ------------------------ |
| Language             | JavaScript          | TypeScript               |
| Architecture         | MVC                 | Component-based          |
| Mobile Support       | Limited             | Full support             |
| CLI                  | None                | Angular CLI              |
| Data Binding         | Two-way with $scope | Property & Event binding |
| Dependency Injection | Basic               | Hierarchical DI          |

### Angular Architecture Overview

Angular applications are built using several key building blocks:

```
┌─────────────────────────────────────────────────────────┐
│                      Angular App                         │
├─────────────────────────────────────────────────────────┤
│  Modules (@NgModule)                                     │
│  ├── Components (@Component)                             │
│  │   ├── Template (HTML)                                │
│  │   ├── Styles (CSS/SCSS)                              │
│  │   └── Class (TypeScript)                             │
│  ├── Services (@Injectable)                              │
│  ├── Directives (@Directive)                            │
│  ├── Pipes (@Pipe)                                      │
│  └── Guards & Interceptors                              │
└─────────────────────────────────────────────────────────┘
```

### Angular CLI Essentials

```bash
# Create new project
ng new my-app

# Generate components, services, etc.
ng generate component my-component
ng generate service my-service
ng generate module my-module
ng generate directive my-directive
ng generate pipe my-pipe
ng generate guard my-guard

# Serve application
ng serve --open

# Build for production
ng build --configuration=production

# Run tests
ng test
ng e2e
```

---

## 2. Components

### What is a Component?

A component is the fundamental building block of Angular applications. It controls a portion of the screen called a view and consists of a TypeScript class, an HTML template, and optional styles.

### Component Structure

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  // Or inline template and styles:
  // template: `<div>{{ user.name }}</div>`,
  // styles: [`.card { padding: 16px; }`]
})
export class UserCardComponent {
  @Input() user: User;
  @Output() userSelected = new EventEmitter<User>();

  selectUser(): void {
    this.userSelected.emit(this.user);
  }
}
```

### Component Communication

**Parent to Child (Input Binding):**

```typescript
// Parent component
@Component({
  template: `<app-child [message]="parentMessage"></app-child>`,
})
export class ParentComponent {
  parentMessage = 'Hello from parent';
}

// Child component
@Component({
  selector: 'app-child',
  template: `<p>{{ message }}</p>`,
})
export class ChildComponent {
  @Input() message: string;

  // With setter for transformation/validation
  private _count: number;
  @Input()
  set count(value: number) {
    this._count = value > 0 ? value : 0;
  }
  get count(): number {
    return this._count;
  }
}
```

**Child to Parent (Output/EventEmitter):**

```typescript
// Child component
@Component({
  selector: 'app-child',
  template: `<button (click)="sendMessage()">Send</button>`,
})
export class ChildComponent {
  @Output() messageEvent = new EventEmitter<string>();

  sendMessage(): void {
    this.messageEvent.emit('Hello from child');
  }
}

// Parent component
@Component({
  template: `
    <app-child (messageEvent)="receiveMessage($event)"></app-child>
    <p>{{ message }}</p>
  `,
})
export class ParentComponent {
  message: string;

  receiveMessage(msg: string): void {
    this.message = msg;
  }
}
```

**ViewChild & ContentChild:**

```typescript
@Component({
  selector: 'app-parent',
  template: `
    <app-child #childRef></app-child>
    <ng-content></ng-content>
  `,
})
export class ParentComponent implements AfterViewInit {
  @ViewChild('childRef') childComponent: ChildComponent;
  @ViewChild('childRef', { read: ElementRef }) childElement: ElementRef;
  @ContentChild(SomeDirective) contentChild: SomeDirective;

  ngAfterViewInit(): void {
    console.log(this.childComponent.someMethod());
  }
}
```

### Component Selectors

```typescript
@Component({
  // Element selector (most common)
  selector: 'app-user',

  // Attribute selector
  // selector: '[appUser]',

  // Class selector
  // selector: '.app-user',
})
```

---

## 3. Templates & Data Binding

### Types of Data Binding

Angular provides four types of data binding:

```typescript
@Component({
  template: `
    <!-- 1. Interpolation (one-way: component → view) -->
    <h1>{{ title }}</h1>
    <p>{{ user.name | uppercase }}</p>
    <p>{{ getFullName() }}</p>

    <!-- 2. Property Binding (one-way: component → view) -->
    <img [src]="imageUrl" />
    <button [disabled]="isDisabled">Click</button>
    <div [class.active]="isActive"></div>
    <div [style.color]="textColor"></div>
    <input [attr.aria-label]="label" />

    <!-- 3. Event Binding (one-way: view → component) -->
    <button (click)="onClick()">Click</button>
    <input (input)="onInput($event)" />
    <form (submit)="onSubmit()">
      <!-- 4. Two-way Binding (component ↔ view) -->
      <input [(ngModel)]="username" />
      <!-- Equivalent to: -->
      <input [ngModel]="username" (ngModelChange)="username = $event" />
    </form>
  `,
})
export class BindingComponent {
  title = 'My App';
  imageUrl = 'path/to/image.png';
  isDisabled = false;
  isActive = true;
  textColor = 'blue';
  username = '';

  onClick(): void {
    /* handle click */
  }
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
  }
}
```

### Template Reference Variables

```html
<!-- Reference to DOM element -->
<input #nameInput type="text" />
<button (click)="greet(nameInput.value)">Greet</button>

<!-- Reference to component instance -->
<app-child #childComp></app-child>
<button (click)="childComp.doSomething()">Call Child</button>

<!-- Reference to directive -->
<form #myForm="ngForm">
  <button [disabled]="!myForm.valid">Submit</button>
</form>
```

### Template Expressions & Statements

```html
<!-- Template expressions (read-only, no side effects) -->
<p>{{ 1 + 1 }}</p>
<p>{{ user?.name }}</p>
<p>{{ items?.length ?? 0 }}</p>
<p>{{ condition ? 'Yes' : 'No' }}</p>

<!-- Template statements (can have side effects) -->
<button (click)="counter = counter + 1">Increment</button>
<button (click)="deleteItem(item); logAction('deleted')">Delete</button>
```

### Safe Navigation Operator

```html
<!-- Prevents null/undefined errors -->
<p>{{ user?.address?.city }}</p>

<!-- With method calls -->
<p>{{ user?.getFullName?.() }}</p>

<!-- Non-null assertion (use when certain value exists) -->
<p>{{ user!.name }}</p>
```

---

## 4. Directives

### Types of Directives

Angular has three types of directives:

1. **Component Directives** - Directives with a template
2. **Structural Directives** - Change DOM structure (*ngIf, *ngFor, \*ngSwitch)
3. **Attribute Directives** - Change appearance/behavior (ngClass, ngStyle)

### Structural Directives

```html
<!-- *ngIf -->
<div *ngIf="isVisible">Visible content</div>
<div *ngIf="user; else noUser">{{ user.name }}</div>
<ng-template #noUser>No user found</ng-template>

<!-- *ngIf with as (aliasing) -->
<div *ngIf="user$ | async as user">{{ user.name }}</div>

<!-- @if (Angular 17+ control flow) -->
@if (isVisible) {
<div>Visible content</div>
} @else if (condition) {
<div>Alternative</div>
} @else {
<div>Default</div>
}

<!-- *ngFor -->
<li
  *ngFor="let item of items; index as i; first as isFirst; last as isLast; even as isEven; odd as isOdd; trackBy: trackByFn"
>
  {{ i }}: {{ item.name }}
</li>

<!-- @for (Angular 17+ control flow) -->
@for (item of items; track item.id; let i = $index) {
<li>{{ i }}: {{ item.name }}</li>
} @empty {
<li>No items found</li>
}

<!-- *ngSwitch -->
<div [ngSwitch]="color">
  <p *ngSwitchCase="'red'">Red color</p>
  <p *ngSwitchCase="'blue'">Blue color</p>
  <p *ngSwitchDefault>Unknown color</p>
</div>

<!-- @switch (Angular 17+ control flow) -->
@switch (color) { @case ('red') {
<p>Red color</p>
} @case ('blue') {
<p>Blue color</p>
} @default {
<p>Unknown color</p>
} }
```

### TrackBy Function

```typescript
// Without trackBy, Angular re-renders entire list on changes
// With trackBy, Angular only updates changed items

@Component({
  template: `
    <li *ngFor="let item of items; trackBy: trackById">
      {{ item.name }}
    </li>
  `,
})
export class ListComponent {
  items: Item[] = [];

  trackById(index: number, item: Item): number {
    return item.id;
  }
}
```

### Attribute Directives

```html
<!-- ngClass -->
<div [ngClass]="'single-class'"></div>
<div [ngClass]="['class1', 'class2']"></div>
<div [ngClass]="{ 'active': isActive, 'disabled': isDisabled }"></div>

<!-- ngStyle -->
<div [ngStyle]="{ 'color': textColor, 'font-size.px': fontSize }"></div>

<!-- Class binding shortcuts -->
<div [class.active]="isActive"></div>
<div [class]="classExpression"></div>

<!-- Style binding shortcuts -->
<div [style.color]="isActive ? 'green' : 'red'"></div>
<div [style.width.px]="width"></div>
```

### Custom Directive

```typescript
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  @Input() appHighlight = 'yellow';
  @Input() defaultColor = 'transparent';

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.highlight(this.appHighlight || 'yellow');
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.highlight(this.defaultColor);
  }

  private highlight(color: string): void {
    this.el.nativeElement.style.backgroundColor = color;
  }
}

// Usage
// <p appHighlight="lightblue">Hover over me!</p>
```

### Custom Structural Directive

```typescript
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appUnless]',
})
export class UnlessDirective {
  private hasView = false;

  @Input()
  set appUnless(condition: boolean) {
    if (!condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}
}

// Usage
// <div *appUnless="condition">Show when condition is false</div>
```

---

## 5. Pipes

### Built-in Pipes

```html
<!-- DatePipe -->
<p>{{ today | date }}</p>
<p>{{ today | date:'short' }}</p>
<p>{{ today | date:'fullDate' }}</p>
<p>{{ today | date:'yyyy-MM-dd HH:mm:ss' }}</p>

<!-- CurrencyPipe -->
<p>{{ price | currency }}</p>
<p>{{ price | currency:'EUR':'symbol':'1.2-2' }}</p>

<!-- DecimalPipe -->
<p>{{ value | number:'1.2-4' }}</p>
<!-- minIntegerDigits.minFractionDigits-maxFractionDigits -->

<!-- PercentPipe -->
<p>{{ ratio | percent:'1.1-2' }}</p>

<!-- UpperCase / LowerCase / TitleCase -->
<p>{{ text | uppercase }}</p>
<p>{{ text | lowercase }}</p>
<p>{{ text | titlecase }}</p>

<!-- SlicePipe -->
<p>{{ 'Hello World' | slice:0:5 }}</p>
<li *ngFor="let item of items | slice:0:10">{{ item }}</li>

<!-- JsonPipe (debugging) -->
<pre>{{ object | json }}</pre>

<!-- KeyValuePipe -->
<div *ngFor="let item of object | keyvalue">
  {{ item.key }}: {{ item.value }}
</div>

<!-- AsyncPipe -->
<p>{{ observable$ | async }}</p>
<div *ngIf="data$ | async as data">{{ data.name }}</div>
```

### Custom Pipe

```typescript
import { Pipe, PipeTransform } from '@angular/core';

// Pure pipe (default) - only called when input value changes
@Pipe({
  name: 'truncate',
  pure: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50, trail: string = '...'): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}

// Usage: {{ longText | truncate:100:'...' }}

// Impure pipe - called on every change detection cycle
@Pipe({
  name: 'filter',
  pure: false,
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, property: string): any[] {
    if (!items || !searchText) return items;

    return items.filter((item) =>
      item[property].toLowerCase().includes(searchText.toLowerCase())
    );
  }
}

// Usage: *ngFor="let item of items | filter:searchText:'name'"
```

### Pure vs Impure Pipes

| Aspect      | Pure Pipe                         | Impure Pipe                  |
| ----------- | --------------------------------- | ---------------------------- |
| Execution   | Only when input reference changes | Every change detection cycle |
| Performance | Better                            | Can impact performance       |
| Use case    | Primitive values, immutable data  | Mutable objects, arrays      |
| Setting     | `pure: true` (default)            | `pure: false`                |

---

## 6. Services & Dependency Injection

### What is Dependency Injection?

Dependency Injection (DI) is a design pattern where dependencies are provided to a class rather than created inside it. Angular's DI system manages the creation and injection of dependencies.

### Creating a Service

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root', // Singleton at root level
})
export class UserService {
  private apiUrl = '/api/users';
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

### Injection Tokens & Providers

```typescript
import { InjectionToken, NgModule } from '@angular/core';

// Create injection token for non-class dependencies
export const API_URL = new InjectionToken<string>('API_URL');
export const CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

// Different provider types
@NgModule({
  providers: [
    // Class provider (default)
    UserService,
    // Same as: { provide: UserService, useClass: UserService }

    // Alternative implementation
    { provide: UserService, useClass: MockUserService },

    // Value provider
    { provide: API_URL, useValue: 'https://api.example.com' },

    // Factory provider
    {
      provide: CONFIG,
      useFactory: (http: HttpClient) => {
        return new ConfigService(http).loadConfig();
      },
      deps: [HttpClient],
    },

    // Existing provider (alias)
    { provide: 'OldService', useExisting: NewService },
  ],
})
export class AppModule {}

// Injecting token
@Injectable()
export class ApiService {
  constructor(@Inject(API_URL) private apiUrl: string) {}
}
```

### Provider Scopes

```typescript
// Root scope - singleton for entire app
@Injectable({
  providedIn: 'root',
})
export class GlobalService {}

// Module scope - singleton per module
@Injectable({
  providedIn: SomeModule,
})
export class ModuleScopedService {}

// Component scope - new instance per component
@Component({
  providers: [LocalService],
})
export class MyComponent {
  constructor(private localService: LocalService) {}
}
```

### Hierarchical Dependency Injection

```
             ┌─────────────────┐
             │   Root Module   │ ← Root Injector
             │  (AppModule)    │
             └────────┬────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
┌───────┴───────┐          ┌───────┴───────┐
│ Feature Module│          │ Feature Module│ ← Module Injectors
│   (UserModule)│          │  (AdminModule)│
└───────┬───────┘          └───────┬───────┘
        │                           │
┌───────┴───────┐          ┌───────┴───────┐
│   Component   │          │   Component   │ ← Element Injectors
│   (UserList)  │          │  (AdminPanel) │
└───────────────┘          └───────────────┘
```

### @Optional, @Self, @SkipSelf, @Host

```typescript
@Component({...})
export class MyComponent {
  constructor(
    // Optional - doesn't throw if not found
    @Optional() private optionalService: OptionalService,

    // Self - only look in current injector
    @Self() private selfService: SelfService,

    // SkipSelf - skip current injector, look in parent
    @SkipSelf() private parentService: ParentService,

    // Host - stop at host component injector
    @Host() private hostService: HostService
  ) {}
}
```

---

## 7. Modules

### NgModule Structure

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  // Components, directives, pipes that belong to this module
  declarations: [MyComponent, MyDirective, MyPipe],

  // Other modules whose exported classes are needed
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],

  // Services available at module level
  providers: [MyService, { provide: API_URL, useValue: '/api' }],

  // Components/directives/pipes available to other modules
  exports: [MyComponent, MyDirective],

  // Only in root module - the root component
  bootstrap: [AppComponent],
})
export class MyModule {}
```

### Feature Modules

```typescript
// user.module.ts
@NgModule({
  declarations: [UserListComponent, UserDetailComponent, UserFormComponent],
  imports: [CommonModule, SharedModule, UserRoutingModule],
  exports: [UserListComponent],
})
export class UserModule {}
```

### Shared Module

```typescript
// shared.module.ts
@NgModule({
  declarations: [LoadingSpinnerComponent, HighlightDirective, TruncatePipe],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [
    // Re-export common modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Export shared components
    LoadingSpinnerComponent,
    HighlightDirective,
    TruncatePipe,
  ],
})
export class SharedModule {}
```

### Core Module

```typescript
// core.module.ts - singleton services, app-wide components
@NgModule({
  declarations: [HeaderComponent, FooterComponent, NotFoundComponent],
  imports: [CommonModule, RouterModule],
  exports: [HeaderComponent, FooterComponent],
  providers: [
    AuthService,
    LoggerService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class CoreModule {
  // Prevent reimporting
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in AppModule only.'
      );
    }
  }
}
```

### Lazy Loading Modules

```typescript
// app-routing.module.ts
const routes: Routes = [
  {
    path: 'users',
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canLoad: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

---

## 8. Routing & Navigation

### Route Configuration

```typescript
const routes: Routes = [
  // Basic route
  { path: '', component: HomeComponent },

  // Route with parameter
  { path: 'user/:id', component: UserDetailComponent },

  // Route with multiple parameters
  { path: 'user/:userId/post/:postId', component: PostComponent },

  // Route with query parameters (handled in component)
  { path: 'search', component: SearchComponent },

  // Child routes
  {
    path: 'products',
    component: ProductsComponent,
    children: [
      { path: '', component: ProductListComponent },
      { path: ':id', component: ProductDetailComponent },
      { path: ':id/edit', component: ProductEditComponent },
    ],
  },

  // Lazy loaded route
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },

  // Route with guards
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedChangesGuard],
    resolve: { data: DataResolver },
  },

  // Redirect
  { path: 'home', redirectTo: '', pathMatch: 'full' },

  // Wildcard (404)
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      scrollPositionRestoration: 'enabled',
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

### Router Navigation

```typescript
@Component({
  template: `
    <!-- Router link -->
    <a routerLink="/users">Users</a>
    <a [routerLink]="['/user', userId]">User Detail</a>
    <a [routerLink]="['/search']" [queryParams]="{ q: 'angular' }">Search</a>

    <!-- Active link styling -->
    <a routerLink="/home" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>

    <!-- Router outlet -->
    <router-outlet></router-outlet>

    <!-- Named outlets -->
    <router-outlet name="sidebar"></router-outlet>
  `
})
export class AppComponent {
  userId = 1;
}

// Programmatic navigation
@Component({...})
export class NavigationComponent {
  constructor(private router: Router) {}

  navigateToUser(id: number): void {
    // Navigate with path
    this.router.navigate(['/user', id]);

    // Navigate with query params
    this.router.navigate(['/search'], {
      queryParams: { q: 'angular', page: 1 },
      queryParamsHandling: 'merge' // 'preserve' | 'merge' | ''
    });

    // Navigate with fragment
    this.router.navigate(['/page'], { fragment: 'section1' });

    // Navigate relative to current route
    this.router.navigate(['../sibling'], { relativeTo: this.route });

    // Navigate by URL
    this.router.navigateByUrl('/user/1?tab=profile#settings');
  }
}
```

### Accessing Route Parameters

```typescript
@Component({...})
export class UserComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Snapshot (one-time read)
    const id = this.route.snapshot.paramMap.get('id');
    const query = this.route.snapshot.queryParamMap.get('q');
    const fragment = this.route.snapshot.fragment;

    // Observable (for reacting to changes)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
    });

    this.route.queryParamMap.subscribe(params => {
      const search = params.get('q');
    });

    // Combined params, query params, data, and fragment
    this.route.data.subscribe(data => {
      // Resolved data
    });

    // Access parent route params
    this.route.parent?.paramMap.subscribe(params => {
      const parentId = params.get('parentId');
    });
  }
}
```

### Route Guards

```typescript
// Auth Guard
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Redirect to login with return URL
    return this.router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }
}

// Functional guard (Angular 15+)
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated()
    ? true
    : router.createUrlTree(['/login']);
};

// Can Deactivate Guard
@Injectable({ providedIn: 'root' })
export class UnsavedChangesGuard
  implements CanDeactivate<ComponentWithUnsavedChanges>
{
  canDeactivate(component: ComponentWithUnsavedChanges): boolean {
    if (component.hasUnsavedChanges()) {
      return confirm('You have unsaved changes. Do you want to leave?');
    }
    return true;
  }
}

// Resolver
@Injectable({ providedIn: 'root' })
export class UserResolver implements Resolve<User> {
  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    return this.userService.getUserById(+route.paramMap.get('id')!);
  }
}

// Usage in routes
const routes: Routes = [
  {
    path: 'user/:id',
    component: UserComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedChangesGuard],
    resolve: { user: UserResolver },
  },
];
```

---

## 9. Forms

### Template-Driven Forms

```typescript
// app.module.ts
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [FormsModule],
})
export class AppModule {}

// component
@Component({
  template: `
    <form #userForm="ngForm" (ngSubmit)="onSubmit(userForm)">
      <div>
        <label for="name">Name:</label>
        <input
          id="name"
          name="name"
          [(ngModel)]="user.name"
          required
          minlength="3"
          #name="ngModel"
        />
        <div *ngIf="name.invalid && name.touched">
          <span *ngIf="name.errors?.['required']">Name is required</span>
          <span *ngIf="name.errors?.['minlength']">Min 3 characters</span>
        </div>
      </div>

      <div>
        <label for="email">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          [(ngModel)]="user.email"
          required
          email
          #email="ngModel"
        />
        <div *ngIf="email.invalid && email.touched">
          <span *ngIf="email.errors?.['required']">Email is required</span>
          <span *ngIf="email.errors?.['email']">Invalid email</span>
        </div>
      </div>

      <button type="submit" [disabled]="userForm.invalid">Submit</button>
    </form>
  `,
})
export class TemplateFormComponent {
  user = { name: '', email: '' };

  onSubmit(form: NgForm): void {
    if (form.valid) {
      console.log('Form data:', this.user);
    }
  }
}
```

### Reactive Forms

```typescript
// app.module.ts
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [ReactiveFormsModule],
})
export class AppModule {}

// component
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
} from '@angular/forms';

@Component({
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <div>
        <label for="name">Name:</label>
        <input id="name" formControlName="name" />
        <div
          *ngIf="userForm.get('name')?.invalid && userForm.get('name')?.touched"
        >
          <span *ngIf="userForm.get('name')?.errors?.['required']"
            >Name is required</span
          >
          <span *ngIf="userForm.get('name')?.errors?.['minlength']"
            >Min 3 characters</span
          >
        </div>
      </div>

      <div>
        <label for="email">Email:</label>
        <input id="email" type="email" formControlName="email" />
      </div>

      <!-- Nested form group -->
      <div formGroupName="address">
        <input formControlName="street" placeholder="Street" />
        <input formControlName="city" placeholder="City" />
      </div>

      <!-- Form array -->
      <div formArrayName="phones">
        <div *ngFor="let phone of phones.controls; let i = index">
          <input [formControlName]="i" placeholder="Phone {{ i + 1 }}" />
          <button type="button" (click)="removePhone(i)">Remove</button>
        </div>
        <button type="button" (click)="addPhone()">Add Phone</button>
      </div>

      <button type="submit" [disabled]="userForm.invalid">Submit</button>
    </form>
  `,
})
export class ReactiveFormComponent implements OnInit {
  userForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      address: this.fb.group({
        street: [''],
        city: ['', Validators.required],
      }),
      phones: this.fb.array([this.fb.control('')]),
    });

    // Listen to value changes
    this.userForm.valueChanges.subscribe((value) => {
      console.log('Form value:', value);
    });

    // Listen to specific control
    this.userForm.get('email')?.valueChanges.subscribe((email) => {
      console.log('Email changed:', email);
    });
  }

  get phones(): FormArray {
    return this.userForm.get('phones') as FormArray;
  }

  addPhone(): void {
    this.phones.push(this.fb.control(''));
  }

  removePhone(index: number): void {
    this.phones.removeAt(index);
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log('Form data:', this.userForm.value);
      // Get raw value (includes disabled controls)
      console.log('Raw value:', this.userForm.getRawValue());
    } else {
      // Mark all as touched to show errors
      this.userForm.markAllAsTouched();
    }
  }

  // Programmatic control
  resetForm(): void {
    this.userForm.reset();
  }

  patchValues(): void {
    this.userForm.patchValue({ name: 'John' }); // Partial update
    this.userForm.setValue({
      /* all values required */
    }); // Full update
  }
}
```

### Custom Validators

```typescript
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  AsyncValidatorFn,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, delay, catchError } from 'rxjs/operators';

// Sync validator function
export function forbiddenNameValidator(forbiddenName: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = forbiddenName.test(control.value);
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}

// Cross-field validator
export function passwordMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}

// Async validator
export function uniqueEmailValidator(
  userService: UserService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return userService.checkEmailExists(control.value).pipe(
      map((exists) => (exists ? { emailTaken: true } : null)),
      catchError(() => of(null))
    );
  };
}

// Usage
this.form = this.fb.group(
  {
    username: ['', [Validators.required, forbiddenNameValidator(/admin/i)]],
    email: [
      '',
      [Validators.required, Validators.email],
      [uniqueEmailValidator(this.userService)],
    ],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  },
  { validators: passwordMatchValidator() }
);
```

### Template-Driven vs Reactive Forms

| Aspect        | Template-Driven       | Reactive               |
| ------------- | --------------------- | ---------------------- |
| Setup         | FormsModule           | ReactiveFormsModule    |
| Form model    | Implicit (directive)  | Explicit (component)   |
| Data flow     | Async                 | Sync                   |
| Validation    | Directives            | Functions              |
| Testing       | Harder (requires DOM) | Easier (no DOM needed) |
| Scalability   | Simple forms          | Complex forms          |
| Dynamic forms | Difficult             | Easy                   |

---

## 10. HTTP & API Communication

### HttpClient Setup

```typescript
// app.module.ts
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule],
})
export class AppModule {}

// For standalone apps
bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()],
});
```

### HTTP Methods

```typescript
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = 'https://api.example.com';

  constructor(private http: HttpClient) {}

  // GET request
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  // GET with query params
  searchUsers(query: string, page: number): Observable<User[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('limit', '10');

    return this.http.get<User[]>(`${this.apiUrl}/users`, { params });
  }

  // GET with headers
  getProtectedData(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer token',
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.apiUrl}/protected`, { headers });
  }

  // POST request
  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

  // PUT request
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user);
  }

  // PATCH request
  patchUser(id: number, updates: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}`, updates);
  }

  // DELETE request
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  // Request with full response (headers, status)
  getUsersWithResponse(): Observable<HttpResponse<User[]>> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, {
      observe: 'response',
    });
  }

  // Upload file
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  // Error handling
  getUsersWithErrorHandling(): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.apiUrl}/users`)
      .pipe(retry(3), timeout(10000), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
```

### HTTP Interceptors

```typescript
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

// Auth Interceptor
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(clonedReq);
    }

    return next.handle(req);
  }
}

// Error Interceptor
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          this.router.navigate(['/forbidden']);
        } else if (error.status >= 500) {
          // Show error notification
        }
        return throwError(() => error);
      })
    );
  }
}

// Loading Interceptor
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loadingService.show();

    return next.handle(req).pipe(finalize(() => this.loadingService.hide()));
  }
}

// Register interceptors
@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
})
export class AppModule {}

// Functional interceptor (Angular 15+)
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req);
};

// Register functional interceptor
bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
});
```

---

## 11. RxJS & Observables

### Observable Basics

```typescript
import {
  Observable,
  of,
  from,
  interval,
  fromEvent,
  Subject,
  BehaviorSubject,
  ReplaySubject,
} from 'rxjs';

// Creating observables
const numbers$ = of(1, 2, 3, 4, 5);
const array$ = from([1, 2, 3, 4, 5]);
const timer$ = interval(1000);
const clicks$ = fromEvent(document, 'click');

// Custom observable
const custom$ = new Observable<number>((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);

  setTimeout(() => {
    subscriber.next(4);
    subscriber.complete();
  }, 1000);

  // Cleanup logic
  return () => {
    console.log('Observable cleaned up');
  };
});

// Subscribing
const subscription = custom$.subscribe({
  next: (value) => console.log('Value:', value),
  error: (err) => console.error('Error:', err),
  complete: () => console.log('Complete'),
});

// Unsubscribe
subscription.unsubscribe();
```

### Common RxJS Operators

```typescript
import {
  map,
  filter,
  tap,
  take,
  takeUntil,
  first,
  switchMap,
  mergeMap,
  concatMap,
  exhaustMap,
  debounceTime,
  distinctUntilChanged,
  throttleTime,
  catchError,
  retry,
  retryWhen,
  combineLatest,
  forkJoin,
  merge,
  concat,
  startWith,
  withLatestFrom,
  shareReplay,
  scan,
  reduce,
  pluck,
} from 'rxjs/operators';

// Transformation operators
source$.pipe(
  map((x) => x * 2),
  filter((x) => x > 10),
  tap((x) => console.log('Value:', x))
);

// Higher-order mapping operators
searchTerm$.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap((term) => this.searchService.search(term)) // Cancels previous
);

userId$.pipe(
  mergeMap((id) => this.userService.getUser(id)) // Concurrent requests
);

actions$.pipe(
  concatMap((action) => this.processAction(action)) // Sequential
);

clicks$.pipe(
  exhaustMap(() => this.saveData()) // Ignores while busy
);

// Combination operators
combineLatest([user$, permissions$]).pipe(
  map(([user, permissions]) => ({ user, permissions }))
);

forkJoin({
  users: this.getUsers(),
  posts: this.getPosts(),
  comments: this.getComments(),
}).subscribe((result) => {
  // result = { users: [...], posts: [...], comments: [...] }
});

// Error handling
source$.pipe(
  retry(3),
  catchError((error) => of(fallbackValue))
);
```

### Subjects

```typescript
// Subject - no initial value, multicasts to multiple subscribers
const subject = new Subject<number>();
subject.subscribe((x) => console.log('A:', x));
subject.subscribe((x) => console.log('B:', x));
subject.next(1); // Both receive 1
subject.next(2); // Both receive 2

// BehaviorSubject - requires initial value, emits current value to new subscribers
const behavior$ = new BehaviorSubject<number>(0);
behavior$.subscribe((x) => console.log('A:', x)); // Receives 0 immediately
behavior$.next(1);
behavior$.subscribe((x) => console.log('B:', x)); // Receives 1 immediately
console.log(behavior$.getValue()); // Get current value: 1

// ReplaySubject - replays n values to new subscribers
const replay$ = new ReplaySubject<number>(3); // Buffer size 3
replay$.next(1);
replay$.next(2);
replay$.next(3);
replay$.next(4);
replay$.subscribe((x) => console.log(x)); // Receives 2, 3, 4

// AsyncSubject - emits only the last value on complete
const async$ = new AsyncSubject<number>();
async$.next(1);
async$.next(2);
async$.subscribe((x) => console.log(x)); // Nothing yet
async$.complete(); // Now receives 2
```

### Unsubscribing Patterns

```typescript
@Component({...})
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Pattern 1: takeUntil with destroy subject
  ngOnInit(): void {
    this.dataService.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.processData(data));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Pattern 2: Async pipe (auto-unsubscribes)
  data$ = this.dataService.getData();
  // In template: {{ data$ | async }}

  // Pattern 3: Manual subscription management
  private subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(
      this.source1$.subscribe(/* ... */)
    );
    this.subscription.add(
      this.source2$.subscribe(/* ... */)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Pattern 4: take/first operators
  getData(): void {
    this.dataService.getData()
      .pipe(take(1)) // or first()
      .subscribe(data => this.processData(data));
  }

  // Pattern 5: DestroyRef (Angular 16+)
  constructor() {
    const destroyRef = inject(DestroyRef);

    this.dataService.getData()
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe(data => this.processData(data));
  }
}
```

---

## 12. Lifecycle Hooks

### Component Lifecycle

```typescript
import {
  OnChanges,
  OnInit,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-lifecycle',
  template: `
    <ng-content></ng-content>
    <app-child></app-child>
  `,
})
export class LifecycleComponent
  implements
    OnChanges,
    OnInit,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy
{
  @Input() data: any;
  @ContentChild('projected') projectedContent: ElementRef;
  @ViewChild(ChildComponent) childComponent: ChildComponent;

  // 1. Called when @Input properties change (before ngOnInit)
  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges', changes);
    if (changes['data']) {
      const prev = changes['data'].previousValue;
      const curr = changes['data'].currentValue;
      const first = changes['data'].firstChange;
    }
  }

  // 2. Called once after first ngOnChanges
  ngOnInit(): void {
    console.log('ngOnInit');
    // Initialize component
    // Make HTTP calls
    // Set up subscriptions
  }

  // 3. Called on every change detection run
  ngDoCheck(): void {
    console.log('ngDoCheck');
    // Custom change detection logic
    // Use sparingly - impacts performance
  }

  // 4. Called after content (ng-content) is projected
  ngAfterContentInit(): void {
    console.log('ngAfterContentInit');
    // Access projected content
    console.log(this.projectedContent);
  }

  // 5. Called after every check of projected content
  ngAfterContentChecked(): void {
    console.log('ngAfterContentChecked');
  }

  // 6. Called after component's view (and child views) initialized
  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    // Access view children
    console.log(this.childComponent);
  }

  // 7. Called after every check of component's view
  ngAfterViewChecked(): void {
    console.log('ngAfterViewChecked');
  }

  // 8. Called just before component is destroyed
  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    // Cleanup subscriptions
    // Detach event handlers
    // Stop timers
  }
}
```

### Lifecycle Order

```
Constructor
    ↓
ngOnChanges (if inputs exist)
    ↓
ngOnInit
    ↓
ngDoCheck
    ↓
ngAfterContentInit
    ↓
ngAfterContentChecked
    ↓
ngAfterViewInit
    ↓
ngAfterViewChecked
    ↓
[Change Detection Cycle]
    ↓
ngOnChanges (if inputs changed)
    ↓
ngDoCheck
    ↓
ngAfterContentChecked
    ↓
ngAfterViewChecked
    ↓
ngOnDestroy
```

---

## 13. Change Detection

### How Change Detection Works

Angular's change detection checks if the component's template bindings have changed and updates the DOM accordingly. By default, it runs from root to leaves, checking every component.

```
       AppComponent (check)
           /      \
    UserList     Sidebar (check)
    (check)          |
       |          Profile
     User         (check)
    (check)
```

### Change Detection Strategies

```typescript
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

// Default strategy - checks component on every cycle
@Component({
  selector: 'app-default',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DefaultComponent {}

// OnPush strategy - checks only when:
// 1. Input reference changes
// 2. Event handler fires in component
// 3. Async pipe emits new value
// 4. Manual trigger via ChangeDetectorRef
@Component({
  selector: 'app-onpush',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnPushComponent {
  @Input() data: Data; // Must use immutable data

  constructor(private cdr: ChangeDetectorRef) {}

  // Manual change detection
  updateData(): void {
    // Modify data...
    this.cdr.markForCheck(); // Mark component and ancestors for check
    // or
    this.cdr.detectChanges(); // Run change detection immediately
  }

  // Detach from change detection tree
  detachComponent(): void {
    this.cdr.detach();
  }

  // Reattach to change detection tree
  reattachComponent(): void {
    this.cdr.reattach();
  }
}
```

### OnPush Best Practices

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptimizedComponent {
  // Use observables with async pipe
  data$ = this.dataService.getData();

  // Use immutable updates
  @Input() items: Item[];

  addItem(item: Item): void {
    // Wrong - mutates array
    // this.items.push(item);

    // Correct - creates new array reference
    this.items = [...this.items, item];
  }

  updateItem(index: number, updates: Partial<Item>): void {
    this.items = this.items.map((item, i) =>
      i === index ? { ...item, ...updates } : item
    );
  }
}
```

### NgZone

```typescript
import { NgZone } from '@angular/core';

@Component({...})
export class ZoneComponent {
  constructor(private ngZone: NgZone) {}

  // Run outside Angular zone (no change detection)
  runOutsideAngular(): void {
    this.ngZone.runOutsideAngular(() => {
      // Heavy computation
      // Third-party library callbacks
      // Animation frames
      setInterval(() => {
        // This won't trigger change detection
      }, 100);
    });
  }

  // Run inside Angular zone (triggers change detection)
  runInsideAngular(): void {
    this.ngZone.run(() => {
      // Update component state
      this.data = newData;
    });
  }
}
```

---

## 14. State Management

### Service-based State Management

```typescript
@Injectable({ providedIn: 'root' })
export class StateService {
  private state = new BehaviorSubject<AppState>({
    users: [],
    loading: false,
    error: null,
  });

  // Expose state as observable
  state$ = this.state.asObservable();

  // Selectors
  users$ = this.state$.pipe(map((state) => state.users));
  loading$ = this.state$.pipe(map((state) => state.loading));

  // Actions
  setLoading(loading: boolean): void {
    this.updateState({ loading });
  }

  setUsers(users: User[]): void {
    this.updateState({ users, loading: false });
  }

  addUser(user: User): void {
    const users = [...this.state.getValue().users, user];
    this.updateState({ users });
  }

  private updateState(partialState: Partial<AppState>): void {
    this.state.next({ ...this.state.getValue(), ...partialState });
  }
}
```

### NgRx Overview

NgRx is a reactive state management library inspired by Redux.

```typescript
// State interface
interface AppState {
  users: UsersState;
}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

// Actions
import { createAction, props } from '@ngrx/store';

export const loadUsers = createAction('[Users] Load Users');
export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ users: User[] }>()
);
export const loadUsersFailure = createAction(
  '[Users] Load Users Failure',
  props<{ error: string }>()
);

// Reducer
import { createReducer, on } from '@ngrx/store';

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null
};

export const usersReducer = createReducer(
  initialState,
  on(loadUsers, state => ({ ...state, loading: true })),
  on(loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false
  })),
  on(loadUsersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);

// Selectors
import { createSelector, createFeatureSelector } from '@ngrx/store';

export const selectUsersState = createFeatureSelector<UsersState>('users');
export const selectAllUsers = createSelector(
  selectUsersState,
  state => state.users
);
export const selectLoading = createSelector(
  selectUsersState,
  state => state.loading
);

// Effects
import { Actions, createEffect, ofType } from '@ngrx/effects';

@Injectable()
export class UsersEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      switchMap(() =>
        this.usersService.getUsers().pipe(
          map(users => loadUsersSuccess({ users })),
          catchError(error => of(loadUsersFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private usersService: UsersService
  ) {}
}

// Component usage
@Component({...})
export class UsersComponent {
  users$ = this.store.select(selectAllUsers);
  loading$ = this.store.select(selectLoading);

  constructor(private store: Store<AppState>) {}

  loadUsers(): void {
    this.store.dispatch(loadUsers());
  }
}
```

---

## 15. Testing

### Unit Testing Components

```typescript
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserComponent],
      imports: [FormsModule],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user name', () => {
    component.user = { name: 'John', email: 'john@example.com' };
    fixture.detectChanges();

    const nameElement = debugElement.query(By.css('.user-name'));
    expect(nameElement.nativeElement.textContent).toContain('John');
  });

  it('should emit event on button click', () => {
    spyOn(component.userSelected, 'emit');

    const button = debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);

    expect(component.userSelected.emit).toHaveBeenCalled();
  });

  it('should handle async operation', fakeAsync(() => {
    component.loadData();
    tick(1000); // Simulate time passage
    fixture.detectChanges();

    expect(component.data).toBeDefined();
  }));
});
```

### Testing Services

```typescript
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify no outstanding requests
  });

  it('should fetch users', () => {
    const mockUsers = [{ id: 1, name: 'John' }];

    service.getUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should handle error', () => {
    service.getUsers().subscribe({
      next: () => fail('Should have failed'),
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne('/api/users');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
```

### Testing with Spies and Mocks

```typescript
describe('Component with dependencies', () => {
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    mockUserService = jasmine.createSpyObj('UserService', [
      'getUsers',
      'createUser',
    ]);
    mockUserService.getUsers.and.returnValue(of([{ id: 1, name: 'John' }]));

    TestBed.configureTestingModule({
      declarations: [UserListComponent],
      providers: [{ provide: UserService, useValue: mockUserService }],
    });
  });

  it('should call getUsers on init', () => {
    const fixture = TestBed.createComponent(UserListComponent);
    fixture.detectChanges();

    expect(mockUserService.getUsers).toHaveBeenCalled();
  });
});
```

---

## 16. Performance Optimization

### Lazy Loading

```typescript
// Lazy load modules
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
];

// Lazy load standalone components (Angular 14+)
const routes: Routes = [
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then((c) => c.ProfileComponent),
  },
];

// Preloading strategies
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules, // or custom strategy
    }),
  ],
})
export class AppRoutingModule {}
```

### OnPush Change Detection

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptimizedComponent {
  // Use immutable data patterns
  // Use async pipe for observables
}
```

### TrackBy for ngFor

```typescript
@Component({
  template: `
    <div *ngFor="let item of items; trackBy: trackById">
      {{ item.name }}
    </div>
  `,
})
export class ListComponent {
  trackById(index: number, item: Item): number {
    return item.id;
  }
}
```

### Virtual Scrolling

```typescript
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  template: `
    <cdk-virtual-scroll-viewport itemSize="50" class="viewport">
      <div *cdkVirtualFor="let item of items" class="item">
        {{ item.name }}
      </div>
    </cdk-virtual-scroll-viewport>
  `,
  styles: [
    `
      .viewport {
        height: 400px;
      }
      .item {
        height: 50px;
      }
    `,
  ],
})
export class VirtualListComponent {
  items = Array.from({ length: 10000 }, (_, i) => ({ name: `Item ${i}` }));
}
```

### Deferrable Views (Angular 17+)

```html
<!-- Defer loading until visible -->
@defer (on viewport) {
<app-heavy-component />
} @placeholder {
<div>Loading...</div>
} @loading (minimum 500ms) {
<app-spinner />
} @error {
<p>Failed to load</p>
}

<!-- Defer with conditions -->
@defer (when isVisible; on interaction) {
<app-comments />
}

<!-- Prefetch -->
@defer (on viewport; prefetch on idle) {
<app-footer />
}
```

### Bundle Optimization

```json
// angular.json
{
  "projects": {
    "app": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                }
              ],
              "optimization": true,
              "sourceMap": false
            }
          }
        }
      }
    }
  }
}
```

---

## 17. Angular Signals

### Introduction to Signals (Angular 16+)

Signals are a new reactive primitive in Angular that provide fine-grained reactivity.

```typescript
import { signal, computed, effect } from '@angular/core';

@Component({
  template: `
    <p>Count: {{ count() }}</p>
    <p>Double: {{ doubleCount() }}</p>
    <button (click)="increment()">Increment</button>
  `,
})
export class SignalsComponent {
  // Writable signal
  count = signal(0);

  // Computed signal (derived state)
  doubleCount = computed(() => this.count() * 2);

  constructor() {
    // Effect - side effect that runs when signals change
    effect(() => {
      console.log('Count changed:', this.count());
    });
  }

  increment(): void {
    // Update methods
    this.count.set(this.count() + 1);
    // or
    this.count.update((value) => value + 1);
  }
}
```

### Signal-based Inputs and Outputs (Angular 17.1+)

```typescript
import { input, output, model } from '@angular/core';

@Component({
  selector: 'app-user-card',
})
export class UserCardComponent {
  // Required input
  user = input.required<User>();

  // Optional input with default
  showActions = input(true);

  // Input with transform
  age = input(0, { transform: numberAttribute });

  // Output
  userSelected = output<User>();

  // Two-way binding (model)
  isExpanded = model(false);

  selectUser(): void {
    this.userSelected.emit(this.user());
  }
}

// Usage
// <app-user-card [user]="user" [(isExpanded)]="expanded" (userSelected)="onSelect($event)" />
```

### Converting Between Signals and Observables

```typescript
import { toSignal, toObservable } from '@angular/core/rxjs-interop';

@Component({...})
export class InteropComponent {
  // Observable to Signal
  private data$ = this.http.get<Data>('/api/data');
  data = toSignal(this.data$, { initialValue: null });

  // Signal to Observable
  count = signal(0);
  count$ = toObservable(this.count);

  constructor(private http: HttpClient) {}
}
```

---

## 18. Standalone Components

### Creating Standalone Components (Angular 14+)

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-standalone',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    // Other standalone components or modules
  ],
  template: `
    <h1>Standalone Component</h1>
    <router-outlet></router-outlet>
  `,
})
export class StandaloneComponent {}
```

### Bootstrapping Standalone Application

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/interceptors/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    // Other providers
  ],
}).catch((err) => console.error(err));
```

### Routing with Standalone Components

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./users/users.component').then((c) => c.UsersComponent),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then((r) => r.ADMIN_ROUTES),
  },
];

// admin.routes.ts
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
];
```

---

## 19. Security

### Cross-Site Scripting (XSS) Prevention

Angular automatically sanitizes values and escapes untrusted content.

```typescript
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';

@Component({
  template: `
    <!-- Automatically sanitized -->
    <div>{{ userInput }}</div>
    <div [innerHTML]="userHtml"></div>

    <!-- Bypass sanitization (use with caution!) -->
    <div [innerHTML]="trustedHtml"></div>
  `,
})
export class SecurityComponent {
  userInput = '<script>alert("XSS")</script>'; // Escaped
  userHtml = '<b>Bold</b><script>alert("XSS")</script>'; // Script removed

  trustedHtml: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    // Only use when you trust the source!
    this.trustedHtml = this.sanitizer.bypassSecurityTrustHtml(
      '<b>Trusted content</b>'
    );
  }

  // Trust different contexts
  trustUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  trustResourceUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
```

### Content Security Policy (CSP)

```html
<!-- index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
/>
```

### HTTP Security Headers

```typescript
// Server configuration example (Express)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );
  next();
});
```

### CSRF Protection

```typescript
// Angular HttpClient automatically includes XSRF token
// Configure cookie/header names if needed
import { HttpClientXsrfModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
  ],
})
export class AppModule {}
```

---

## 20. Advanced Concepts

### Content Projection

```typescript
// Single slot projection
@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardComponent {}

// Multi-slot projection
@Component({
  selector: 'app-modal',
  template: `
    <div class="modal">
      <header>
        <ng-content select="[modal-header]"></ng-content>
      </header>
      <main>
        <ng-content select="[modal-body]"></ng-content>
      </main>
      <footer>
        <ng-content select="[modal-footer]"></ng-content>
      </footer>
    </div>
  `,
})
export class ModalComponent {}

// Usage
// <app-modal>
//   <div modal-header>Title</div>
//   <div modal-body>Content</div>
//   <div modal-footer>Actions</div>
// </app-modal>

// Conditional projection with ngProjectAs
@Component({
  template: `
    <ng-content select="button"></ng-content>
    <ng-content select="[action]"></ng-content>
  `,
})
export class ActionBarComponent {}

// <app-action-bar>
//   <ng-container ngProjectAs="button">
//     <custom-button></custom-button>
//   </ng-container>
// </app-action-bar>
```

### ng-template, ng-container, ngTemplateOutlet

```typescript
@Component({
  template: `
    <!-- ng-template - doesn't render unless used -->
    <ng-template #myTemplate let-name="name" let-age="age">
      <p>Name: {{ name }}, Age: {{ age }}</p>
    </ng-template>

    <!-- ng-container - grouping without extra DOM element -->
    <ng-container *ngIf="condition">
      <p>First paragraph</p>
      <p>Second paragraph</p>
    </ng-container>

    <!-- ngTemplateOutlet - render template dynamically -->
    <ng-container
      *ngTemplateOutlet="myTemplate; context: templateContext"
    ></ng-container>

    <!-- Conditional template -->
    <ng-container
      *ngTemplateOutlet="isSpecial ? specialTemplate : defaultTemplate"
    >
    </ng-container>
  `,
})
export class TemplateComponent {
  templateContext = { name: 'John', age: 30 };
  isSpecial = true;
}
```

### Dynamic Components

```typescript
import { ViewContainerRef, ComponentRef, Type } from '@angular/core';

@Component({
  template: `<ng-container #container></ng-container>`,
})
export class DynamicHostComponent {
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  loadComponent<T>(component: Type<T>, data?: any): ComponentRef<T> {
    this.container.clear();
    const componentRef = this.container.createComponent(component);

    // Pass inputs
    if (data) {
      Object.assign(componentRef.instance, data);
    }

    return componentRef;
  }

  // With Angular 16+ - simpler approach
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  async loadLazyComponent(): Promise<void> {
    const { LazyComponent } = await import('./lazy/lazy.component');
    this.container.createComponent(LazyComponent);
  }
}
```

### Host Binding and Host Listener

```typescript
@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;
  @HostBinding('attr.aria-expanded') get ariaExpanded() {
    return this.isOpen;
  }
  @HostBinding('style.backgroundColor') bgColor = 'transparent';

  @HostListener('click') toggle(): void {
    this.isOpen = !this.isOpen;
    this.bgColor = this.isOpen ? 'lightblue' : 'transparent';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  constructor(private elementRef: ElementRef) {}
}

// Using host in component decorator
@Component({
  selector: 'app-button',
  host: {
    '[class.active]': 'isActive',
    '(click)': 'onClick()',
    role: 'button',
  },
})
export class ButtonComponent {
  isActive = false;
  onClick(): void {
    /* ... */
  }
}
```

### Renderer2

```typescript
import { Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    // Safe DOM manipulation
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', 'yellow');
    this.renderer.addClass(this.el.nativeElement, 'highlighted');
    this.renderer.setAttribute(this.el.nativeElement, 'aria-selected', 'true');
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.renderer.removeStyle(this.el.nativeElement, 'backgroundColor');
    this.renderer.removeClass(this.el.nativeElement, 'highlighted');
    this.renderer.removeAttribute(this.el.nativeElement, 'aria-selected');
  }

  createDynamicElement(): void {
    const div = this.renderer.createElement('div');
    const text = this.renderer.createText('Dynamic content');
    this.renderer.appendChild(div, text);
    this.renderer.appendChild(this.el.nativeElement, div);
  }
}
```

---

## Quick Reference Cheat Sheet

### CLI Commands

```bash
ng new app-name                    # Create new app
ng generate component name         # Generate component
ng generate service name           # Generate service
ng generate module name            # Generate module
ng serve                           # Start dev server
ng build --configuration=prod      # Production build
ng test                            # Run unit tests
ng e2e                             # Run e2e tests
ng lint                            # Lint code
ng update                          # Update Angular
```

### Common Decorators

| Decorator     | Purpose                 |
| ------------- | ----------------------- |
| @Component    | Define a component      |
| @Directive    | Define a directive      |
| @Pipe         | Define a pipe           |
| @Injectable   | Define a service        |
| @NgModule     | Define a module         |
| @Input        | Input property binding  |
| @Output       | Output event binding    |
| @ViewChild    | Query view element      |
| @ContentChild | Query projected content |
| @HostBinding  | Bind host property      |
| @HostListener | Listen to host events   |

### Template Syntax

| Syntax                    | Description           |
| ------------------------- | --------------------- |
| `{{ expression }}`        | Interpolation         |
| `[property]="expr"`       | Property binding      |
| `(event)="handler()"`     | Event binding         |
| `[(ngModel)]="prop"`      | Two-way binding       |
| `*ngIf="condition"`       | Conditional rendering |
| `*ngFor="let i of items"` | Loop rendering        |
| `[ngClass]="{...}"`       | Class binding         |
| `[ngStyle]="{...}"`       | Style binding         |
| `#ref`                    | Template reference    |
| `@if`, `@for`, `@switch`  | Control flow (v17+)   |

---

## Interview Tips

1. **Understand the fundamentals** - Components, services, DI, and data binding are core concepts
2. **Know lifecycle hooks** - Especially ngOnInit, ngOnChanges, ngOnDestroy
3. **Explain change detection** - Default vs OnPush strategies and their implications
4. **RxJS proficiency** - Understand operators, subjects, and subscription management
5. **Forms comparison** - Know when to use template-driven vs reactive forms
6. **Performance optimization** - Lazy loading, trackBy, OnPush, virtual scrolling
7. **Testing knowledge** - Unit testing components, services, and HTTP calls
8. **State management** - Service-based state, NgRx concepts
9. **Security awareness** - XSS prevention, sanitization, CSRF protection
10. **Stay updated** - Know about signals, standalone components, and new control flow syntax

---
