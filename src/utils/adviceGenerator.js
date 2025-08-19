const adviceDatabase = {
  health: {
    low: [
      '🏃‍♀️ 週に3回、15分の散歩から始めてみましょう',
      '💤 睡眠時間を30分延ばしてみませんか？',
      '🥗 1日1食を野菜中心のメニューに変えてみましょう',
      '🧘‍♀️ 5分間の深呼吸やストレッチを取り入れてみては？',
    ],
    medium: [
      '🎯 現在の健康習慣を継続し、少しずつ運動量を増やしましょう',
      '📱 スマートウォッチで歩数を記録してモチベーションを上げましょう',
      '🥤 水分補給を意識的に増やしてみてください',
    ],
    high: [
      '✨ 素晴らしい健康状態です！この調子を維持しましょう',
      '👥 友人や家族と一緒に運動することで、更に楽しく続けられます',
    ],
  },
  work: {
    low: [
      '📅 タスクを優先順位で整理し、1日3つの重要なことに集中しましょう',
      '⏰ ポモドーロテクニック（25分集中＋5分休憩）を試してみては？',
      '🎯 小さな目標を設定して達成感を積み重ねましょう',
      '💬 上司や同僚とのコミュニケーションを増やしてみてください',
    ],
    medium: [
      '📈 現在の仕事ペースを維持しつつ、新しいスキル習得を検討してみては？',
      '🤝 チームワークを活かしてより効率的に作業を進めましょう',
    ],
    high: [
      '🎉 仕事が充実していますね！この調子で頑張ってください',
      '📚 専門知識を深めたり、後輩の指導にチャレンジしてみては？',
    ],
  },
  hobby: {
    low: [
      '🎨 週に1回、30分だけでも好きなことをする時間を作りましょう',
      '📖 通勤時間に読書や音楽鑑賞を取り入れてみては？',
      '🌱 新しい趣味にチャレンジしてみる良い機会です',
      '📺 好きな映画やドラマを見てリラックスする時間を作りましょう',
    ],
    medium: [
      '⏰ 趣味の時間をもう少し増やせるよう、スケジュールを見直してみましょう',
      '👭 同じ趣味を持つ仲間と交流してみてはいかがでしょうか？',
    ],
    high: [
      '🌟 趣味が充実していて素晴らしいです！',
      '🎯 趣味を通じて新しいスキルや友達を得られるかもしれません',
    ],
  },
  relationships: {
    low: [
      '📱 家族や友人に簡単なメッセージを送ってみましょう',
      '☕ 週1回、誰かとお茶やランチをする時間を作ってみては？',
      '🎁 大切な人への小さなサプライズを考えてみましょう',
      '💌 感謝の気持ちを言葉にして伝えてみてください',
    ],
    medium: [
      '🗣️ より深い会話をする機会を増やしてみましょう',
      '🎪 友人や家族と一緒に新しい体験をしてみては？',
    ],
    high: [
      '💝 人間関係が豊かで素晴らしいですね！',
      '🤗 周りの人へのサポートや感謝を忘れずに',
    ],
  },
  learning: {
    low: [
      '📱 通勤時間にポッドキャストや教育系YouTubeを聞いてみましょう',
      '📚 1日10分でも読書の時間を作ってみては？',
      '💻 オンライン学習サービスで興味のある分野を学んでみましょう',
      '📝 新しく学んだことを日記に書いて記録してみてください',
    ],
    medium: [
      '🎓 資格取得やスキルアップのための計画を立ててみましょう',
      '👥 勉強会やセミナーに参加して仲間と学び合いませんか？',
    ],
    high: [
      '🌟 学習意欲が高くて素晴らしいです！',
      '📖 学んだことを実践に活かしたり、他の人に教えてみてください',
    ],
  },
};

export function generateAdvice(scores) {
  const advice = [];
  
  Object.entries(scores).forEach(([category, score]) => {
    let level;
    if (score <= 4) level = 'low';
    else if (score <= 7) level = 'medium';
    else level = 'high';
    
    const categoryAdvice = adviceDatabase[category][level];
    const randomAdvice = categoryAdvice[Math.floor(Math.random() * categoryAdvice.length)];
    
    advice.push({
      category,
      score,
      level,
      advice: randomAdvice,
    });
  });
  
  return advice.sort((a, b) => a.score - b.score);
}

export function getOverallBalance(scores) {
  const values = Object.values(scores);
  const average = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
  const standardDeviation = Math.sqrt(variance);
  
  let balanceLevel;
  let balanceMessage;
  
  if (standardDeviation <= 1.5) {
    balanceLevel = 'excellent';
    balanceMessage = '🎯 とてもバランスの取れた生活を送っていますね！';
  } else if (standardDeviation <= 2.5) {
    balanceLevel = 'good';
    balanceMessage = '👍 概ねバランスが取れています。少し調整するとより良くなりそうです。';
  } else {
    balanceLevel = 'needs_improvement';
    balanceMessage = '⚖️ 生活のバランスを見直してみましょう。特に低い項目に注目してください。';
  }
  
  return {
    level: balanceLevel,
    message: balanceMessage,
    average: Math.round(average * 10) / 10,
    deviation: Math.round(standardDeviation * 10) / 10,
  };
}