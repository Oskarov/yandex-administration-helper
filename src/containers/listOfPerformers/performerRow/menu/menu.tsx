import React, { useContext } from 'react';
import { Menu, Divider, MenuItem } from '@mui/material';
import { useDispatch } from 'react-redux';
import { IPerformerItem } from 'interfaces/IPerformers';
import { PerformerModalContextChanger } from 'contexts/performerModalContext/performerContext';
import { TASK_TYPES_ENUM } from 'interfaces/ITask';
import { setConfirmationOpen } from 'slices/modal';
import { removePerformer } from 'slices/performers';

interface IMenuProps {
  contextMenu: { mouseX: number; mouseY: number } | null;
  setContextMenu: React.Dispatch<
    React.SetStateAction<{ mouseX: number; mouseY: number } | null>
  >;
  performer: IPerformerItem;
}

const PerformerMenu: React.FC<IMenuProps> = ({
  contextMenu,
  setContextMenu,
  performer,
}) => {
  const dispatch = useDispatch();
  const performerModalAction = useContext(PerformerModalContextChanger);

  const handleEdit = () => {
    if (performerModalAction) {
      performerModalAction({
        id: performer.uuid,
      });
    }
  };

  /**
   * Возвращает текущие разрешения по работе с буфером обмена.
   * Возможные варианты: "granted", "denied", "prompt"
   * Если браузер стар и не поддерживает работу с буфером обмена,
   * то всегда будет denied
   */
  const getClipboardPermissions = async (): Promise<PermissionState> => {
    const permissionKey = {
      name: 'clipboard-write',
    } as unknown as PermissionDescriptor;
    const permissions = await navigator?.permissions.query(permissionKey);
    return permissions.state || 'denied';
  };

  function unsecuredCopyToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus({ preventScroll: true });
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Unable to copy to clipboard', err);
    }
    document.body.removeChild(textArea);
  }

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleCopy = () => {
    let text = 'Задачи нового спринта:\r\n';
    performer.tasks
      .filter(
        task =>
          ![
            TASK_TYPES_ENUM.VACATION,
            TASK_TYPES_ENUM.REVIEW,
            TASK_TYPES_ENUM.HOLLYDAYS,
            TASK_TYPES_ENUM.MEETINGS,
          ].includes(task.type),
      )
      .forEach(task => {
        text =
          text +
          `[${task.project}] ${task.name} (https://tracker.yandex.ru/${task.number})\r\n`;
      });
    const cp = navigator.clipboard;
    if (!cp) {
      alert(
        'Браузер не поддерживает работу с буфером обмена на http протоколе',
      );
      unsecuredCopyToClipboard(text);
    } else {
      cp.writeText(text).catch(async e => {
        const permissions = await getClipboardPermissions();
        if (permissions === 'denied')
          throw new Error(
            'В вашем браузере выставлен запрет на копирование в буфер обмена!',
          );
        throw e;
      });
    }
  };

  const handleDelete = () => {
    dispatch(
      setConfirmationOpen({
        dialogType: 'positive',
        dialogText: `Вы точно хотите удалить исполнителя ${performer.lastName} ${performer.firstName}?`,
        confirmationFunction: () => {
          dispatch(removePerformer(performer.uuid));
        },
      }),
    );
  };

  return (
    <Menu
      open={contextMenu !== null}
      onClose={handleClose}
      anchorReference='anchorPosition'
      anchorPosition={
        contextMenu !== null
          ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
          : undefined
      }
    >
      <MenuItem disabled={true}>
        {performer.lastName} {performer.firstName}
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleEdit}>Редактировать</MenuItem>
      <Divider />
      <MenuItem style={{ color: 'red' }} onClick={handleDelete}>
        Удалить исполнителя
      </MenuItem>
    </Menu>
  );
};

export default PerformerMenu;
