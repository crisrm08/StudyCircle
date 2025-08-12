import { supabase } from "../config/supabase.js";

export const getSubjectsWithTopics = async (req, res, next) => {
  try {
    const { data: subjects, error: subjErr } = await supabase.from('subjects').select('*');
    if (subjErr) return res.status(500).json({ error: subjErr.message });

    const formattedSubjects = subjects.map(s => ({ id: s.subject_id, name: s.subject_name }));

    const { data: topics, error: topErr } = await supabase.from('topics').select('*');
    if (topErr) return res.status(500).json({ error: topErr.message });

    const bySubject = {};
    topics.forEach(t => {
      (bySubject[t.subject_id] ||= []).push({ id: t.topic_id, name: t.topic_name });
    });

    const subjectsWithTopics = formattedSubjects.map(s => ({ ...s, topics: bySubject[s.id] || [] }));
    res.json(subjectsWithTopics);
  } catch (err) {
    next(err);
  }
};

export const getUserTopics = async (req, res, next) => {
  try {
    const user_id = req.query.user_id;
    if (!user_id) return res.status(400).json({ error: "user_id requerido" });

    const { data, error } = await supabase
      .from('user_topics')
      .select('type, topics(topic_name)')
      .eq('user_id', user_id);

    if (error) return res.status(500).json({ error: error.message });

    const result = { weak: [], strong: [], teaches: [] };
    data.forEach(d => {
      if (d.type === 'weak'    && d.topics) result.weak.push(d.topics.topic_name);
      if (d.type === 'strong'  && d.topics) result.strong.push(d.topics.topic_name);
      if (d.type === 'teaches' && d.topics) result.teaches.push(d.topics.topic_name);
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getOccupationsAndLevels = async (req, res, next) => {
  try {
    const { data: ocupations, error: occErr } = await supabase.from('ocupations').select('*');
    if (occErr) return res.status(500).json({ error: occErr.message });

    const { data: academicLevels, error: lvlErr } = await supabase.from('academic_levels').select('*');
    if (lvlErr) return res.status(500).json({ error: lvlErr.message });

    res.json({
      ocupations: ocupations.map(o => ({ value: o.ocupation_id,     label: o.ocupation_name })),
      academicLevels: academicLevels.map(l => ({ value: l.academic_level_id, label: l.academic_level_name }))
    });
  } catch (err) {
    next(err);
  }
};

export const getCareers = async (req, res, next) => {
  try {
    const { data: careers, error: carErr } = await supabase.from('careers').select('*');
    if (carErr) return res.status(500).json({ error: carErr.message });

    res.json(careers.map(c => ({ id: c.career_id, name: c.career_name })));
  } catch (err) {
    next(err);
  }
};
