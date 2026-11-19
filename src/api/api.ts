// API Client - Student Exercise
//
// API base: http://localhost:4000
//
// The API is intercepted by MSW during development.
//
// Your task:
// Complete the TODOs below using TypeScript and fetch().
import { 
  User,
  AuthResponse,
  RegisterData,
  LoginData,
  Project,
  CreateProjectData,
  UpdateProjectData, 
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters,
  HttpMethod,
   } from '../types';

const BASE_URL = 'http://localhost:4000';

// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: Create application types
// ─────────────────────────────────────────────────────────────────────────────
//
// Create proper TypeScript interfaces/types for:
//
// User
// - id
// - name
// - email
//
// AuthResponse
// - token
// - user
//
// RegisterData
// - name
// - email
// - password
//
// LoginData
// - email
// - password
//
// Project
// - id
// - name
// - description
//
// CreateProjectData
//
// UpdateProjectData
//
// Task
// - id
// - projectId
// - title
// - description
// - status
// - priority
// - assignee
// - dueDate
//
// CreateTaskData
//
// UpdateTaskData
//
// TaskFilters
// - status
// - priority
// - assignee
// - search
//
// IMPORTANT:
// After creating these types, replace the temporary "unknown" types below
// with your proper TypeScript types.

// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Authentication token
// ─────────────────────────────────────────────────────────────────────────────
const TOKEN_KEY = 'tf_token';
const USER_KEY = 'tf_user';
const getToken = (): string | null => {
  // TODO:
  // Read "tf_token" from localStorage.
  return localStorage.getItem(TOKEN_KEY);
};

const saveSession = (token: string, user: User): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// ─────────────────────────────────────────────────────────────────────────────
// TODO 3: HTTP request helper
// ─────────────────────────────────────────────────────────────────────────────

// TODO:
// Replace "string" with a proper HttpMethod type.
//
// Only allow:
// GET
// POST
// PATCH
// DELETE

const request = async <T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  auth = true,
): Promise<T> => {
  // TODO:
  // 1. Create the HTTP headers.
  //
  // Content-Type should be:
  // application/json
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // TODO:
  // 2. If auth === true:
  // - Get the token using getToken()
  // - Throw an Error if the token doesn't exist
  // - Add the Authorization header
  //
  // Expected format:
  // Bearer <token>
  if (auth) {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  // TODO:
  // 3. Send the request using fetch().
  //
  // Use:
  // - BASE_URL
  // - path
  // - method
  // - headers
  // - body
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // TODO:
  // 4. Handle status 204 No Content.
  if (response.status === 204) {
    return undefined as T;
  }

  // TODO:
  // 5. Parse the JSON response.
  const data = await response.json().catch(() => null);

  // TODO:
  // 6. Handle unsuccessful HTTP responses.
  //
  // Example API validation error:
  //
  // {
  //   error: "validation failed",
  //   fields: {
  //     email: "already taken"
  //   }
  // }
  if (!response.ok) {
    if (data?.fields) {
      const fieldErrors = Object.values(data.fields)[0] as string;
      throw new Error(fieldErrors);
    }
    throw new Error(data?.error || 'Request failed');
  }

  // TODO:
  // 7. Return the successful response.
  return data as T;
  // throw new Error('TODO: Implement request()');
};


// ─────────────────────────────────────────────────────────────────────────────
// TODO 4: HTTP helpers
// ─────────────────────────────────────────────────────────────────────────────

// TODO:
// Create reusable helper functions for:
//
// get<T>()
// post<T>()
// patch<T>()
// del<T>()

const get = <T>(path: string, auth = true): Promise<T> => {
  return request<T>('GET', path, undefined, auth);
}

const post = <T>(path: string, body?: unknown, auth = true): Promise<T> => {
  return request<T>('POST', path, body, auth);
}

const patch = <T>(path: string, body?: unknown, auth = true): Promise<T> => {
  return request<T>('PATCH', path, body, auth);
}

const del = <T>(path: string, auth = true): Promise<T> => {
  return request<T>('DELETE', path, undefined, auth);
}

// ─────────────────────────────────────────────────────────────────────────────
// TODO 5: Authentication
// ─────────────────────────────────────────────────────────────────────────────

export const registerUser = async (
  data: RegisterData,
): Promise<AuthResponse> => {
  // TODO:
  // Replace "unknown" with your RegisterData and AuthResponse types.
  //
  // POST /auth/register
  //
  // Authentication is NOT required.
  //
  // After successful registration:
  // - Save the token
  // - Save the user
  // - Return the response
  const response = await post<AuthResponse>('/auth/register', data, false);
  saveSession(response.token, response.user);
  return response;

  // throw new Error('TODO: Implement registerUser()');
};


export const loginUser = async (
  data: LoginData,
): Promise<AuthResponse> => {
  // TODO:
  // Replace "unknown" with the correct TypeScript types.
  //
  // POST /auth/login
  //
  // Authentication is NOT required.
  //
  // After success:
  // - Save token
  // - Save user
  // - Return response

  const response = await post<AuthResponse>('/auth/login', data, false);
  saveSession(response.token, response.user);
  return response;

  // throw new Error('TODO: Implement loginUser()');
};


export const getMe = (): User | null => {
  // TODO:
  // Replace "unknown" with the proper return type.
  //
  // Read "tf_user" from localStorage.
  // Parse the JSON safely.
  //
  // Return null when:
  // - no user exists
  // - stored JSON is invalid
  try {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;
    return JSON.parse(userJson) as User;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  // TODO:
  // The user is authenticated only when
  // both token and user exist.
  return Boolean(getToken() && getMe());
  // return false;
};


export const logout = (): void => {
  // TODO:
  // Remove:
  // - tf_token
  // - tf_user
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};


// TODO:
// Create a private saveSession() helper.
//
// It should save:
// - token as "tf_token"
// - user as "tf_user"

// ─────────────────────────────────────────────────────────────────────────────
// TODO 6: Projects API
// ─────────────────────────────────────────────────────────────────────────────

export const fetchProjects = async (): Promise<Project[]> => {
  // TODO:
  // Replace "unknown[]" with the proper type.
  //
  // GET /projects
  //
  // Expected response:
  //
  // {
  //   projects: [...]
  // }
  //
  // Return ONLY the projects array.
  const response = await get<{ projects: Project[] }>('/projects');
  return response.projects;
};


export const createProject = async (
  data: CreateProjectData,
): Promise<Project> => {
  // TODO:
  // Add correct TypeScript types.
  //
  // POST /projects
  return post<Project>('/projects', data);
};


export const fetchProject = async (
  id: string,
): Promise<Project> => {
  // TODO:
  // GET /projects/:id
  return get<Project>(`/projects/${id}`);
};


export const updateProject = async (
  id: string,
  data: UpdateProjectData,
): Promise<Project> => {
  // TODO:
  // PATCH /projects/:id
  return patch<Project>(`/projects/${id}`, data);
};


export const deleteProject = async (
  id: string,
): Promise<void> => {
  // TODO:
  // DELETE /projects/:id
  return del<void>(`/projects/${id}`);
};


// ─────────────────────────────────────────────────────────────────────────────
// TODO 7: Tasks API
// ─────────────────────────────────────────────────────────────────────────────

export const fetchTasks = async (
  projectId: string,
  filters: TaskFilters = {},
): Promise<Task[]> => {
  // TODO:
  // Replace temporary types with your Task and TaskFilters types.
  //
  // GET /projects/:projectId/tasks
  //
  // Build the query string using URLSearchParams.
  //
  // Example:
  //
  // /projects/proj-001/tasks?status=todo&priority=high
  //
  // Do NOT add undefined filter values.
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value as string);
    }
  });

  const queryString = params.toString();
  const path = `/projects/${projectId}/tasks${queryString ? `?${queryString}` : ''}`;
  const response = await get<{ tasks: Task[] }>(path);
  return response.tasks;
};


export const createTask = async (
  projectId: string,
  data: CreateTaskData,
): Promise<Task> => {
  // TODO:
  // POST /projects/:projectId/tasks
  //
  // Replace the temporary types.
  return post<Task>(`/projects/${projectId}/tasks`, data);
};


export const updateTask = async (
  taskId: string,
  data: UpdateTaskData,
): Promise<Task> => {
  // TODO:
  // PATCH /tasks/:taskId
  //
  // Replace the temporary types.
  return patch<Task>(`/tasks/${taskId}`, data);
};


export const deleteTask = async (
  taskId: string,
): Promise<void> => {
  // TODO:
  // DELETE /tasks/:taskId
  return del<void>(`/tasks/${taskId}`);
};