import React, { useState } from 'react';
import { IPerformerItem, PERFORMER_TYPES_ENUM } from 'interfaces/IPerformers';
// import { useSelector } from 'react-redux';
// import { TStore } from 'store/store';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import BugReportIcon from '@mui/icons-material/BugReport';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import GamesIcon from '@mui/icons-material/Games';
import PerformerMenu from './menu/menu';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { Tooltip } from '@mui/material';
import styles from './performanceRow.module.scss';

interface PerformerRowProps {
  performer: IPerformerItem;
}

// const getListStyle = (
//   isDraggingOver: boolean,
//   rowSize: number,
//   sprintSize: number,
//   valueOfDivision: number,
// ) => ({
//   background: isDraggingOver ? 'lightblue' : 'rgba(229,229,229,0.36)',
//   display: 'flex',
//   padding: '8px 0',
//   overflow: 'auto',
//   width: `${rowSize * valueOfDivision}px`,
// });

const PerformerRow: React.FC<PerformerRowProps> = ({ performer }) => {
  // const { app } = useSelector((state: TStore) => ({
  //   app: state.app,
  // }));

  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const [open, setOpen] = useState(true);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null,
    );
  };

  return (
    <div className={styles.performer}>
      <div className={styles.titleRow} onContextMenu={handleContextMenu}>
        <div className={styles.left}>
          <div className={styles.icon}>
            {/* FRONTEND */}
            {performer.roleId === PERFORMER_TYPES_ENUM.FRONTEND && (
              <QrCode2Icon />
            )}

            {/* BACKEND */}
            {performer.roleId === PERFORMER_TYPES_ENUM.BACKEND && (
              <IntegrationInstructionsIcon />
            )}

            {/* TEAM_LEAD */}
            {performer.roleId === PERFORMER_TYPES_ENUM.TEAM_LEAD && (
              <GamesIcon />
            )}

            {/* PM */}
            {performer.roleId === PERFORMER_TYPES_ENUM.PM && (
              <ManageAccountsIcon />
            )}

            {/* TESTING */}
            {performer.roleId === PERFORMER_TYPES_ENUM.TESTING && (
              <BugReportIcon />
            )}

            {/* ANALYTICS */}
            {performer.roleId === PERFORMER_TYPES_ENUM.ANALYTICS && (
              <AnalyticsIcon />
            )}
          </div>
          <div
            className={styles.name}
          >{`${performer.lastName} ${performer.firstName}`}</div>

          {performer.trackerId && (
            <Tooltip
              title={`Пользователь трекера: ${performer.trackerDisplay}(${performer.trackerId})`}
            >
              <VerifiedUserIcon className={styles.verified} />
            </Tooltip>
          )}
        </div>
        <div className={styles.right}></div>
      </div>

      <PerformerMenu
        contextMenu={contextMenu}
        setContextMenu={setContextMenu}
        performer={performer}
      />
    </div>
  );
};

export default PerformerRow;
