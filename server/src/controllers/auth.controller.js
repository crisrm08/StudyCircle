import { supabase } from "../config/supabase.js";

export const login = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "No auth header" });
    const token = auth.replace("Bearer ", "");

    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr) return res.status(401).json({ error: authErr.message });

    const { data: profile, error: profErr } = await supabase
      .from("users")
      .select("*")
      .eq("supabase_user_id", user.id)
      .maybeSingle();

    if (profErr) return res.status(500).json({ error: profErr.message });
    if (!profile) return res.status(404).json({ error: "Perfil no encontrado" });

    res.json(profile);
  } catch (err) {
    next(err);
  }
};

export const checkEmail = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Missing email" });

    const { data, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    });
    if (error) return res.status(500).json({ error: error.message });

    const exists = data.users.some(u => u.email === email);
    res.json({ exists });
  } catch (err) {
    next(err);
  }
};
