import { supabase } from "../config/supabase.js";

export const upsertStudentPaymentMethod = async (req, res, next) => {
    const studentId = req.params.id;
    const { card_number, card_holder, expiration_date, security_code, paypal_email } = req.body;

    const { data, error } = await supabase.from('student_payment_methods').upsert({
        student_id: studentId,
        card_number,
        card_holder,
        expiration_date,
        security_code,
        paypal_email
    });

    if (error) {
        next(error);
    }
    res.json(data);
}

export const getStudentPaymentMethod = async (req, res, next) => {
    const studentId = req.params.id;

    const { data, error } = await supabase.from('student_payment_methods').select('*').eq('student_id', studentId).maybeSingle();

    if (error) {
        next(error);
    }

    res.json(data);
}

export const upsertTutorCashingMethod = async (req, res, next) => {
    const tutorId = req.params.id;
    const { bank_name, account_holder, account_number, account_type, paypal_email } = req.body;

    console.log(bank_name, account_holder, account_number, account_type, paypal_email);

    const { data: existing, error: findErr } = await supabase.from('tutor_cashing_methods').select('*').eq('tutor_id', tutorId).maybeSingle();  
    if (findErr) {
        console.error("Error finding existing cashing methods:", findErr);
        return res.status(500).json({ error: findErr.message });
    }

    if (existing) {
        const { data, error } = await supabase.from('tutor_cashing_methods').update({
        bank_name,
        account_holder,
        account_number,
        account_type,
        paypal_email
        }).eq('tutor_id', tutorId);

        if (error) {
        console.error("Error updating tutor cashing methods:", error);
        return res.status(500).json({ error: error.message });
        }

        return res.json({ message: "Cashing methods updated successfully", data });
    }
    else {
        const { data, error } = await supabase.from('tutor_cashing_methods').insert({
        tutor_id: tutorId,
        bank_name,
        account_holder,
        account_number,
        account_type,
        paypal_email
        });
        if (error) {
            next(error);
        }

        return res.json({ message: "Cashing methods created successfully", data });
    }
}

export const getTutorCashingMethod = async (req, res, next) => {
    const tutorId = req.params.id;

    const { data, error } = await supabase.from('tutor_cashing_methods').select('*').eq('tutor_id', tutorId).maybeSingle();

    if (error) {
        next(error);
    }

    res.json(data);
}
