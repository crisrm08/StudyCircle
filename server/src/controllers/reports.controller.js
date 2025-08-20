import { supabase } from "../config/supabase.js";

export const reportUser = async (req, res, next) => {
    try {
      const reportedId = parseInt(req.params.id, 10);
      const { reporter_user_id, report_motive, report_description, tutorship_request_id } = req.body;

      const { data: report, error: insertErr } = await supabase.from('user_reports')
        .insert({ reported_user_id: reportedId, reporter_user_id,report_motive,report_description})
        .select()
        .single();
      if (insertErr) throw insertErr;

      const paths = [];
      for (const file of req.files) {
        const filePath = `tutorship_reported_${tutorship_request_id}/${reportedId}/${Date.now()}_${file.originalname}`;
        const { error: storageErr } = await supabase.storage.from('report.evidence')
          .upload(filePath, file.buffer, {upsert: true, contentType: file.mimetype});
        if (storageErr) throw storageErr;
        paths.push(filePath);
      }

      const { error: updateErr } = await supabase.from('user_reports')
        .update({ evidence_paths: paths }).eq('report_id', report.report_id);
      if (updateErr) throw updateErr;

      const { data: userRec } = await supabase.from('users')
      .select('report_count').eq('user_id', reportedId).single();
      const current = Number(userRec?.report_count) || 0;
      await supabase.from('users').update({ report_count: current + 1 }).eq('user_id', reportedId);

      res.json({ report, evidence: paths });
    } catch (err) {
        next(err);
    }
}

export const getReports = async (res) => {
    const { data: reports, error } = await supabase
        .from('user_reports')
        .select(`report_id, reported_user_id, reporter_user_id,
                report_motive, report_description, evidence_paths`)
        .order('report_id', { ascending: true });
    if (error) throw error;

    const bucket = supabase.storage.from('report.evidence');
    const reportsWithUrls = reports.map(r => ({
        ...r,
        evidence: (r.evidence_paths || []).map(path => {
        const { data: { publicUrl } } = bucket.getPublicUrl(path);
        return publicUrl;
        })
    }));

    res.json(reportsWithUrls);
}

export const discardReport = async (req, res) => {
    const reportId = parseInt(req.params.id, 10);

    try {
        const { data: report, error: fetchErr } = await supabase.from('user_reports')
        .select('reported_user_id, evidence_paths').eq('report_id', reportId).single();
        if (fetchErr) throw fetchErr;
        if (!report) return res.status(404).json({ error: 'Reporte no encontrado' });

        const { reported_user_id, evidence_paths = [] } = report;
        if (evidence_paths.length > 0) {
        const { error: delErr } = await supabase.storage.from('report.evidence').remove(evidence_paths);
        if (delErr) {
            console.warn('No se pudieron borrar todas las evidencias:', delErr);
        }
        }

        const { error: deleteErr } = await supabase.from('user_reports').delete().eq('report_id', reportId);
        if (deleteErr) throw deleteErr;

        const { data: userRow, error: userFetchErr } = await supabase.from('users').select('report_count')
        .eq('user_id', reported_user_id).single();
        if (userFetchErr) throw userFetchErr;
        const newCount = Math.max(0, (userRow.report_count || 0) - 1);

        const { error: userUpdateErr } = await supabase.from('users').update({ report_count: newCount }).eq('user_id', reported_user_id);
        if (userUpdateErr) throw userUpdateErr;

        res.json({ message: 'Reporte descartado', newReportCount: newCount });
    } catch (err) {
        console.error('Error al descartar reporte:', err);
        res.status(500).json({ error: err.message });
    }
}

export const suspendUser = async (req, res) => {
    const reportedUserId = parseInt(req.params.id, 10);
    try {
        const { error } = await supabase.from('users').update({ suspended: true }).eq('user_id', reportedUserId);

        if (error) throw error;
        console.log("suspended");
        
        res.json({ message: `Usuario ${reportedUserId} suspendido` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}