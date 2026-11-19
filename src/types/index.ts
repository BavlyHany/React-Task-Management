export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    owner_id: string;
    created_at: string;
    color?: string;
    task_count?: number;
    done_count?: number;
    tasks?: Task[];
}

export interface CreateProjectData {
    name: string;
    description?: string;
    color?: string;
}

export type UpdateProjectData = Partial<CreateProjectData>;

export interface Task {
    id: string;
    project_id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignee_id: string | null;
    due_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateTaskData {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assignee_id?: string | null;
    due_date?: string | null;
}

export type UpdateTaskData = Partial<CreateTaskData>;

export interface TaskFilters {
    status?: TaskStatus | '';
    priority?: TaskPriority | '';
    assignee?: string;
    search?: string;
}