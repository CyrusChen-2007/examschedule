<div class="fk">
  <input id="tog" type="checkbox" />
  <label for="tog" id="toglabel">{title}</label>
  <div id="content">
    <p>{disclaimer}</p>
    <form id="fk" netlify netlify-honeypot="bot-field">
      <p class="hidden">
        <label>
          {honeypotLabel}: <input name="bot-field" />
        </label>
      </p>
      <textarea
        name="fankui"
        placeholder={placeholder}
        resize="false"
        rows="10"
        type="text"
      />
      <button type="submit">{submitLabel}</button>
    </form>
  </div>
</div>

<script lang="ts">
  export let title = '反馈/免责声明 Feedback/Disclaimer';
  export let disclaimer = '免责声明：本服务提供的考试信息仅供参考，不一定反映真实考试信息，具体请参照官方公布的考试信息。\nDisclaimer: The exam information provided by this service is for reference only and does not necessarily reflect the actual exam information. Please refer to the official exam information for details.';
  export let honeypotLabel = '如果你是人类，请不要填写此框: If you are human, do not click this field';
  export let placeholder = '请输入反馈 Enter your feedback';
  export let submitLabel = '提交反馈 Submit Feedback';
</script>

<style>
  .fk {
    position: fixed;
    left: 0;
    bottom: 0;
    margin: 10px;
    background-color: #fff;
    border: 2px solid #000;
    box-shadow: 3px 2px 0 #000;
    transition: all 0.2s ease-in-out;
    padding: 10px;
    max-width: 45ch;
    z-index: 100;
  }

  .fk:hover {
    box-shadow: 4px 3px 0 #000;
  }

  #tog,
  #toglabel {
    cursor: pointer;
  }

  #tog,
  #content {
    display: none;
  }

  #toglabel::before {
    content: "▶";
  }

  #tog:checked + #toglabel::before {
    content: "▼";
  }

  #tog:checked + #toglabel + #content {
    display: block;
  }

  .hidden {
    opacity: 0;
    display: none;
    transform: scale(0.2) skew(180deg);
  }

  form#fk {
    flex-direction: column;
    max-width: 60ch;
    margin: 10px 0 0 0;
  }

  form#fk > textarea {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    line-height: 14px;
    border: 2px solid #000;
    box-shadow: 3px 2px 0 #000;
    transition: all 0.2s ease-in-out;
  }

  form#fk > textarea:hover {
    outline: none;
    border: 2px solid #00a4aa;
    box-shadow: 4px 3px 0 #00a4aa;
  }

  form#fk > textarea:active {
    border: 2px solid #00a4aa;
    box-shadow: 6px 4px 0 #00a4aa;
  }

  form#fk > button {
    padding: 10px;
    font-size: 16px;
    line-height: 16px;
    color: black;
    background-color: #cdfeff;
    border: 2px solid #007779;
    box-shadow: 3px 2px 0 #007779;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    margin-top: 10px;
  }

  form#fk > button:hover {
    outline: none;
    border: 2px solid #00a4aa;
    box-shadow: 4px 3px 0 #00a4aa;
  }

  form#fk > button:active {
    border: 2px solid #00a4aa;
    box-shadow: 6px 4px 0 #00a4aa;
  }
</style> 