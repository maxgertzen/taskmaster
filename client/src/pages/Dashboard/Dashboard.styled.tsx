import styled from '@emotion/styled';

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const MainLayout = styled.div`
  display: flex;
  flex: 1;
`;

export const SidebarContainer = styled.div`
  width: 250px;
  padding: 1rem;
  background-color: #f4f4f4;
  border-right: 1px solid #ccc;
`;

export const TaskContainer = styled.div`
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
