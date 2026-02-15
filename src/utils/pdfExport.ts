// PDF报告生成工具
import { jsPDF } from 'jspdf';
import type { Profile, DailyRecord, MedicalCheckup, ExerciseLog, WeightLog } from '../types/health';

interface ReportData {
  profile: Profile;
  records: Record<string, DailyRecord>;
  checkups: MedicalCheckup[];
  exerciseLogs: ExerciseLog[];
  weightLogs: WeightLog[];
  currentStreak: number;
}

export const generateMedicalReport = (data: ReportData): void => {
  const { profile, checkups, exerciseLogs, weightLogs, currentStreak } = data;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // 标题
  doc.setFontSize(22);
  doc.setTextColor(0, 122, 255);
  doc.text('脂肪肝健康管理报告', pageWidth / 2, 25, { align: 'center' });

  // 生成日期
  doc.setFontSize(10);
  doc.setTextColor(134, 134, 139);
  doc.text(`生成日期: ${new Date().toLocaleDateString('zh-CN')}`, pageWidth / 2, 33, { align: 'center' });

  let yPos = 50;

  // 基本信息
  doc.setFontSize(14);
  doc.setTextColor(29, 29, 31);
  doc.text('一、基本信息', 20, yPos);
  yPos += 10;

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  const basicInfo = [
    `姓名: ${profile.name}`,
    `身高: ${profile.height} cm`,
    `初始体重: ${profile.initialWeight} kg`,
    `当前体重: ${profile.currentWeight} kg`,
    `目标体重: ${profile.targetWeight} kg`,
    `脂肪肝程度: ${profile.fattyLiverLevel === 'mild' ? '轻度' : profile.fattyLiverLevel === 'moderate' ? '中度' : '重度'}`,
    `每日运动目标: ${profile.targetExerciseMinutes} 分钟`,
  ];

  basicInfo.forEach((info) => {
    doc.text(info, 25, yPos);
    yPos += 7;
  });

  yPos += 5;

  // 体重变化
  doc.setFontSize(14);
  doc.setTextColor(29, 29, 31);
  doc.text('二、体重变化', 20, yPos);
  yPos += 10;

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);

  if (weightLogs.length > 0) {
    const sortedLogs = [...weightLogs].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const firstWeight = sortedLogs[0]?.weight || profile.initialWeight;
    const lastWeight = sortedLogs[sortedLogs.length - 1]?.weight || profile.currentWeight;
    const weightChange = lastWeight - firstWeight;

    doc.text(`记录次数: ${weightLogs.length} 次`, 25, yPos);
    yPos += 7;
    doc.text(`起始体重: ${firstWeight.toFixed(1)} kg`, 25, yPos);
    yPos += 7;
    doc.text(`最新体重: ${lastWeight.toFixed(1)} kg`, 25, yPos);
    yPos += 7;
    const percentChange = ((weightChange / firstWeight) * 100).toFixed(1);
    doc.text(
      `体重变化: ${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} kg (${percentChange}%)`,
      25,
      yPos
    );
    yPos += 7;
  } else {
    doc.text('暂无体重记录', 25, yPos);
    yPos += 7;
  }

  yPos += 5;

  // 运动统计
  doc.setFontSize(14);
  doc.setTextColor(29, 29, 31);
  doc.text('三、运动统计', 20, yPos);
  yPos += 10;

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);

  const totalMinutes = exerciseLogs.reduce((sum, log) => sum + log.duration, 0);
  const avgMinutes = exerciseLogs.length > 0 ? Math.round(totalMinutes / exerciseLogs.length) : 0;

  doc.text(`运动总次数: ${exerciseLogs.length} 次`, 25, yPos);
  yPos += 7;
  doc.text(`累计运动时长: ${totalMinutes} 分钟 (${(totalMinutes / 60).toFixed(1)} 小时)`, 25, yPos);
  yPos += 7;
  doc.text(`平均每次运动: ${avgMinutes} 分钟`, 25, yPos);
  yPos += 7;
  doc.text(`连续打卡: ${currentStreak} 天`, 25, yPos);
  yPos += 7;

  yPos += 5;

  // 医学检查记录
  doc.setFontSize(14);
  doc.setTextColor(29, 29, 31);
  doc.text('四、医学检查记录', 20, yPos);
  yPos += 10;

  if (checkups.length > 0) {
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);

    const sortedCheckups = [...checkups].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    sortedCheckups.slice(0, 5).forEach((checkup) => {
      const typeLabel =
        checkup.type === 'liver_enzyme'
          ? '肝功能'
          : checkup.type === 'ultrasound'
          ? '肝脏超声'
          : checkup.type === 'blood_lipid'
          ? '血脂'
          : '其他';

      doc.text(`• ${checkup.date} - ${checkup.title} (${typeLabel})`, 25, yPos);
      yPos += 7;

      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });
  } else {
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text('暂无检查记录', 25, yPos);
    yPos += 7;
  }

  // 底部提示
  yPos = 280;
  doc.setFontSize(9);
  doc.setTextColor(134, 134, 139);
  doc.text(
    '本报告由脂肪肝健康管理应用自动生成，仅供参考',
    pageWidth / 2,
    yPos,
    { align: 'center' }
  );
  doc.text(
    '请定期就医复查，遵医嘱进行治疗',
    pageWidth / 2,
    yPos + 5,
    { align: 'center' }
  );

  // 保存PDF
  doc.save(`健康报告_${new Date().toISOString().split('T')[0]}.pdf`);
};
