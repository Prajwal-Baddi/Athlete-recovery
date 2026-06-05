import { useState, useEffect } from 'react';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from '../../services/notificationService';
import { socketOn, socketOff, SOCKET_EVENTS } from '../../services/socket';
import { useQueryClient } from '@tanstack/react-query';
import { notifKeys } from '../../services/notificationService';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();

  const { data: notifications = [], isLoading } = useNotifications();
  const markRead    = useMarkNotificationRead();
  const markAll     = useMarkAllNotificationsRead();
  const deleteNotif = useDeleteNotification();

  const unread = notifications.filter((n) => !n.read).length;

  // Socket: invalidate on new notification
  useEffect(() => {
    const handler = () => {
      qc.invalidateQueries({ queryKey: notifKeys.all() });
    };
    socketOn(SOCKET_EVENTS.NOTIFICATION_NEW, handler);
    socketOn(SOCKET_EVENTS.NOTIFICATION_UPDATE, handler);
    return () => {
      socketOff(SOCKET_EVENTS.NOTIFICATION_NEW, handler);
      socketOff(SOCKET_EVENTS.NOTIFICATION_UPDATE, handler);
    };
  }, [qc]);

  return (
    <div className="nb-wrap">
      <button className="nb-btn" onClick={() => setOpen((v) => !v)} aria-label="Notifications">
        <BellIcon />
        {unread > 0 && <span className="nb-badge">{unread > 99 ? '99+' : unread}</span>}
      </button>

      {open && (
        <>
          <div className="nb-backdrop" onClick={() => setOpen(false)} />
          <div className="nb-panel">
            <div className="nb-header">
              <span>Notifications</span>
              {unread > 0 && (
                <button
                  className="nb-mark-all"
                  onClick={() => markAll.mutate()}
                  disabled={markAll.isPending}
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="nb-list">
              {isLoading && <div className="nb-empty">Loading…</div>}
              {!isLoading && notifications.length === 0 && (
                <div className="nb-empty">No notifications.</div>
              )}
              {notifications.map((n) => (
                <NotifItem
                  key={n._id}
                  notif={n}
                  onRead={() => !n.read && markRead.mutate(n._id)}
                  onDelete={() => deleteNotif.mutate(n._id)}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <style>{`
        .nb-wrap { position: relative; display: inline-flex; }
        .nb-btn { position: relative; background: none; border: none; cursor: pointer; padding: 0.5rem; color: #94a3b8; display: flex; align-items: center; border-radius: 8px; transition: color 0.15s, background 0.15s; }
        .nb-btn:hover { color: #f1f5f9; background: #1e293b; }
        .nb-badge { position: absolute; top: 2px; right: 2px; background: #ef4444; color: #fff; font-size: 0.6rem; font-weight: 700; min-width: 16px; height: 16px; border-radius: 999px; display: flex; align-items: center; justify-content: center; padding: 0 3px; border: 2px solid #0f172a; }
        .nb-backdrop { position: fixed; inset: 0; z-index: 40; }
        .nb-panel { position: absolute; top: calc(100% + 8px); right: 0; width: 340px; background: #1e293b; border: 1px solid #334155; border-radius: 12px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6); z-index: 50; overflow: hidden; }
        .nb-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid #334155; font-weight: 600; color: #f1f5f9; font-size: 0.875rem; }
        .nb-mark-all { background: none; border: none; color: #0ea5e9; font-size: 0.75rem; cursor: pointer; padding: 0; }
        .nb-mark-all:hover { text-decoration: underline; }
        .nb-list { max-height: 360px; overflow-y: auto; }
        .nb-empty { padding: 2rem; text-align: center; color: #475569; font-size: 0.875rem; }
        .nb-item { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.875rem 1.25rem; border-bottom: 1px solid #0f172a; cursor: pointer; transition: background 0.1s; }
        .nb-item:hover { background: #0f172a; }
        .nb-item.unread { background: rgba(14,165,233,0.05); }
        .nb-item-dot { width: 8px; height: 8px; border-radius: 50%; background: #0ea5e9; flex-shrink: 0; margin-top: 5px; }
        .nb-item-dot.read { background: transparent; border: 1.5px solid #334155; }
        .nb-item-body { flex: 1; min-width: 0; }
        .nb-item-msg { font-size: 0.8125rem; color: #cbd5e1; line-height: 1.4; }
        .nb-item-time { font-size: 0.7rem; color: #475569; margin-top: 0.25rem; }
        .nb-delete { background: none; border: none; cursor: pointer; color: #475569; font-size: 0.875rem; padding: 0.2rem; border-radius: 4px; flex-shrink: 0; }
        .nb-delete:hover { color: #ef4444; }
      `}</style>
    </div>
  );
}

function NotifItem({ notif, onRead, onDelete }) {
  return (
    <div className={`nb-item ${!notif.read ? 'unread' : ''}`} onClick={onRead}>
      <div className={`nb-item-dot ${notif.read ? 'read' : ''}`} />
      <div className="nb-item-body">
        <div className="nb-item-msg">{notif.message ?? notif.title ?? 'New notification'}</div>
        {notif.createdAt && (
          <div className="nb-item-time">{new Date(notif.createdAt).toLocaleString()}</div>
        )}
      </div>
      <button
        className="nb-delete"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        aria-label="Delete notification"
        title="Delete"
      >
        ×
      </button>
    </div>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2a6 6 0 00-6 6v2.586l-1.707 1.707A1 1 0 003 14h14a1 1 0 00.707-1.707L16 10.586V8a6 6 0 00-6-6z"
        fill="currentColor" fillOpacity="0.8"
      />
      <path d="M8 14a2 2 0 104 0H8z" fill="currentColor" />
    </svg>
  );
}
