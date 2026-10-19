const byId = (id) => document.getElementById(id);

function formatNumber(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 4
  }).format(value);
}

function calculateMomentum() {
  const fields = ["m1", "v1", "m2", "v2"];
  const raw = Object.fromEntries(
    fields.map(id => [id, byId(id).value])
  );

  const values = Object.fromEntries(
    fields.map(id => [id, Number(raw[id])])
  );

  const { m1, v1, m2, v2 } = values;
  const result = byId("result");

  if (
    fields.some(id => raw[id].trim() === "") ||
    fields.some(id => !Number.isFinite(values[id])) ||
    m1 <= 0 ||
    m2 <= 0
  ) {
    result.hidden = false;
    result.innerHTML =
      "<h3>تحقق من المدخلات</h3><p>أدخل جميع القيم، ويجب أن تكون الكتل أكبر من صفر.</p>";
    return;
  }

  const p1 = m1 * v1;
  const p2 = m2 * v2;
  const total = p1 + p2;
  const type = byId("collision").value;

  let html = `
    <h3>النتائج</h3>
    <p>زخم الجسم الأول: <b>${formatNumber(p1)} kg·m/s</b></p>
    <p>زخم الجسم الثاني: <b>${formatNumber(p2)} kg·m/s</b></p>
    <p class="total">الزخم الكلي: ${formatNumber(total)} kg·m/s</p>
  `;

  if (type === "inelastic") {
    const finalVelocity = total / (m1 + m2);

    const direction =
      finalVelocity > 0 ? "باتجاه +x" :
      finalVelocity < 0 ? "باتجاه −x" :
      "السرعة النهائية تساوي صفرًا";

    html += `
      <p>السرعة النهائية للجسمين بعد الالتصاق:
      <b>${formatNumber(finalVelocity)} m/s</b></p>
      <p>الاتجاه: ${direction}</p>
    `;
  } else {
    const v1f =
      ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);

    const v2f =
      (2 * m1 * v1 + (m2 - m1) * v2) / (m1 + m2);

    html += `
      <p>السرعة النهائية للجسم الأول:
      <b>${formatNumber(v1f)} m/s</b></p>
      <p>السرعة النهائية للجسم الثاني:
      <b>${formatNumber(v2f)} m/s</b></p>
      <p>تم الحساب بافتراض تصادم مرن مثالي في بعد واحد.</p>
    `;
  }

  result.innerHTML = html;
  result.hidden = false;
}

function resetCalculator() {
  byId("m1").value = "900";
  byId("v1").value = "20";
  byId("m2").value = "1800";
  byId("v2").value = "10";
  byId("collision").value = "inelastic";
  byId("result").hidden = true;
  byId("result").innerHTML = "";
}

byId("calculate").addEventListener("click", calculateMomentum);
byId("reset").addEventListener("click", resetCalculator);
