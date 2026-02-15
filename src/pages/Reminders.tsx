import { useState } from 'react';
import { useHealthStore } from '../stores/healthStore';
import type { Reminder } from '../types/health';
import { Bell, Plus, Trash2, Clock, Calendar, Activity, ChevronRight, AlertCircle, X } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import { useResponsive, useCardStyle } from '../hooks/useResponsive';

export function Reminders() {
  const { reminders, addReminder, deleteReminder, toggleReminder, checkups, addCheckup } = useHealthStore();
  const { isMobile } = useResponsive();
  const cardStyle = useCardStyle();
  const [isAdding, setIsAdding] = useState(false);
  const [newReminder, setNewReminder] = useState({ type: 'custom' as Reminder['type'], title: '', description: '', time: '09:00', repeatPattern: 'daily' as Reminder['repeatPattern'] });
  const [isAddingCheckup, setIsAddingCheckup] = useState(false);
  const [newCheckup, setNewCheckup] = useState({ type: 'liver_enzyme' as const, title: '', date: new Date().toISOString().split('T')[0], results: {} });

  const handleAddReminder = () => {
    if (!newReminder.title.trim()) return;
    addReminder({ ...newReminder, enabled: true });
    setNewReminder({ type: 'custom', title: '', description: '', time: '09:00', repeatPattern: 'daily' });
    setIsAdding(false);
  };

  const handleAddCheckup = () => {
    if (!newCheckup.title.trim()) return;
    addCheckup({ ...newCheckup, date: newCheckup.date });
    setNewCheckup({ type: 'liver_enzyme', title: '', date: new Date().toISOString().split('T')[0], results: {} });
    setIsAddingCheckup(false);
  };

  const getReminderIcon = (type: Reminder['type']) => {
    switch (type) {
      case 'exercise': return <Activity size={20} color="#007aff" />;
      case 'checkup': return <AlertCircle size={20} color="#ff3b30" />;
      default: return <Bell size={20} color="#86868b" />;
    }
  };

  const getRepeatLabel = (pattern: Reminder['repeatPattern']) => ({ daily: '每天', weekly: '每周', monthly: '每月' }[pattern]);

  return (
    <div style={{ maxWidth: isMobile ? '100%' : 700, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? 16 : 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: isMobile ? 24 : 34, fontWeight: 700, color: '#1d1d1f', margin: 0 }}>提醒管理</h1>
        <button onClick={() => setIsAdding(true)} style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', background: '#007aff', color: 'white', borderRadius: 12, fontSize: 15, fontWeight: 500, border: 'none', cursor: 'pointer' }}>
          <Plus size={18} style={{ marginRight: 6 }} /> 添加提醒
        </button>
      </div>

      {/* Add Reminder Form */}
      {isAdding && (
        <div style={{ ...cardStyle, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1d1d1f', margin: 0 }}>新建提醒</h2>
            <button onClick={() => setIsAdding(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <X size={20} color="#86868b" />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1d1d1f', marginBottom: 8 }}>提醒类型</label>
              <select
                value={newReminder.type}
                onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value as Reminder['type'] })}
                className="input"
              >
                <option value="exercise">运动提醒</option>
                <option value="checkup">检查提醒</option>
                <option value="custom">自定义</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1d1d1f', marginBottom: 8 }}>标题</label>
              <input
                type="text"
                value={newReminder.title}
                onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                className="input"
                placeholder="提醒标题"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1d1d1f', marginBottom: 8 }}>提醒时间</label>
                <input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1d1d1f', marginBottom: 8 }}>重复</label>
                <select
                  value={newReminder.repeatPattern}
                  onChange={(e) => setNewReminder({ ...newReminder, repeatPattern: e.target.value as Reminder['repeatPattern'] })}
                  className="input"
                >
                  <option value="daily">每天</option>
                  <option value="weekly">每周</option>
                  <option value="monthly">每月</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button onClick={handleAddReminder} className="btn btn-primary" style={{ flex: 1 }}>保存提醒</button>
              <button onClick={() => setIsAdding(false)} style={{ padding: '14px 24px', borderRadius: 14, fontWeight: 500, fontSize: 17, background: '#f2f2f7', color: '#1d1d1f', border: 'none', cursor: 'pointer' }}>取消</button>
            </div>
          </div>
        </div>
      )}

      {/* Reminders List */}
      <div style={{ marginBottom: 32 }}>
        {reminders.length === 0 ? (
          <div style={{ ...cardStyle, textAlign: 'center', color: '#86868b', padding: 40 }}>暂无提醒，请添加</div>
        ) : (
          reminders.map((reminder) => (
            <div
              key={reminder.id}
              style={{
                ...cardStyle,
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: reminder.enabled ? 1 : 0.6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ width: 44, height: 44, background: '#f2f2f7', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                  {getReminderIcon(reminder.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 600, color: '#1d1d1f', margin: 0 }}>{reminder.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: '#86868b' }}>
                      <Clock size={14} style={{ marginRight: 4 }} />{reminder.time}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: '#86868b' }}>
                      <Calendar size={14} style={{ marginRight: 4 }} />{getRepeatLabel(reminder.repeatPattern)}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Switch.Root
                  checked={reminder.enabled}
                  onCheckedChange={() => toggleReminder(reminder.id)}
                  style={{
                    width: 51,
                    height: 31,
                    background: reminder.enabled ? '#34c759' : '#e5e5ea',
                    borderRadius: 16,
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.2s',
                  }}
                >
                  <Switch.Thumb style={{
                    display: 'block',
                    width: 27,
                    height: 27,
                    background: 'white',
                    borderRadius: '50%',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s',
                    transform: reminder.enabled ? 'translateX(22px)' : 'translateX(2px)',
                  }} />
                </Switch.Root>
                <button onClick={() => deleteReminder(reminder.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
                  <Trash2 size={20} color="#aeaeb2" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Medical Checkups */}
      <div style={{ borderTop: '1px solid #e5e5ea', paddingTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1d1d1f', margin: 0 }}>医学检查记录</h2>
          <button onClick={() => setIsAddingCheckup(true)} style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', background: '#34c759', color: 'white', borderRadius: 12, fontSize: 15, fontWeight: 500, border: 'none', cursor: 'pointer' }}>
            <Plus size={18} style={{ marginRight: 6 }} /> 添加记录
          </button>
        </div>

        {isAddingCheckup && (
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: '#1d1d1f', margin: 0 }}>新建检查记录</h3>
              <button onClick={() => setIsAddingCheckup(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <X size={20} color="#86868b" />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1d1d1f', marginBottom: 8 }}>检查类型</label>
                <select
                  value={newCheckup.type}
                  onChange={(e) => setNewCheckup({ ...newCheckup, type: e.target.value as typeof newCheckup.type })}
                  className="input"
                >
                  <option value="liver_enzyme">肝功能检查 (ALT/AST/GGT)</option>
                  <option value="ultrasound">肝脏超声</option>
                  <option value="blood_lipid">血脂检查</option>
                  <option value="custom">自定义</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1d1d1f', marginBottom: 8 }}>检查标题</label>
                <input
                  type="text"
                  value={newCheckup.title}
                  onChange={(e) => setNewCheckup({ ...newCheckup, title: e.target.value })}
                  className="input"
                  placeholder="如: 2024年第一季度肝功能检查"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1d1d1f', marginBottom: 8 }}>检查日期</label>
                <input
                  type="date"
                  value={newCheckup.date}
                  onChange={(e) => setNewCheckup({ ...newCheckup, date: e.target.value })}
                  className="input"
                />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button onClick={handleAddCheckup} className="btn btn-primary" style={{ flex: 1, background: '#34c759' }}>保存记录</button>
                <button onClick={() => setIsAddingCheckup(false)} style={{ padding: '14px 24px', borderRadius: 14, fontWeight: 500, fontSize: 17, background: '#f2f2f7', color: '#1d1d1f', border: 'none', cursor: 'pointer' }}>取消</button>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {checkups.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: 'center', color: '#86868b', padding: 40 }}>暂无检查记录</div>
          ) : (
            [...checkups].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((checkup) => (
              <div
                key={checkup.id}
                style={{
                  ...cardStyle,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                    background: checkup.type === 'liver_enzyme' ? 'rgba(255,59,48,0.1)' : checkup.type === 'ultrasound' ? 'rgba(175,82,222,0.1)' : 'rgba(255,149,0,0.1)',
                  }}>
                    <AlertCircle size={20} color={checkup.type === 'liver_enzyme' ? '#ff3b30' : checkup.type === 'ultrasound' ? '#af52de' : '#ff9500'} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1d1d1f', margin: 0 }}>{checkup.title}</h3>
                    <p style={{ fontSize: 14, color: '#86868b', margin: '4px 0 0 0' }}>{checkup.date}</p>
                  </div>
                </div>
                <ChevronRight size={20} color="#aeaeb2" />
              </div>
            ))
          )}
        </div>

        {/* Medical Suggestions */}
        <div style={{ marginTop: 24, padding: 20, background: 'rgba(0,122,255,0.08)', borderRadius: 16 }}>
          <h4 style={{ fontSize: 15, fontWeight: 600, color: '#007aff', margin: '0 0 12px 0' }}>医学建议</h4>
          <ul style={{ fontSize: 14, color: '#007aff', margin: 0, paddingLeft: 16, lineHeight: 1.8 }}>
            <li>肝功能检查 (ALT, AST, GGT): 每 3 个月</li>
            <li>肝脏超声: 每 6 个月</li>
            <li>血脂检查: 每 3-6 个月</li>
            <li>减重 5-10% 可显著改善脂肪肝</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
