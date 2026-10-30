import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { AppLayout } from './components/AppLayout'
import { TasksProvider } from './context/TasksProvider'
import { EditTaskPage } from './pages/EditTaskPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { TasksPage } from './pages/TasksPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <TasksPage /> },
      { path: 'gorev/:taskId', element: <EditTaskPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export function App() {
  return (
    <TasksProvider>
      <RouterProvider router={router} />
    </TasksProvider>
  )
}
