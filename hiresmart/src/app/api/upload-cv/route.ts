

const newCV = new CV({
  user_id: 'supabase-user-id',
  full_name: req.body.full_name,
  email: req.body.email,
  phone: req.body.phone,
  summary: req.body.summary,
  education: req.body.education,
  experience: req.body.experience,
  skills: req.body.skills
})

await newCV.save()
