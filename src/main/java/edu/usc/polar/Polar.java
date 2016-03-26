package edu.usc.polar;
import org.apache.wicket.ajax.json.JSONObject;
import org.apache.wicket.markup.head.IHeaderResponse;
import org.apache.wicket.markup.head.JavaScriptHeaderItem;
import org.apache.wicket.markup.head.OnDomReadyHeaderItem;
import org.apache.wicket.markup.html.WebPage;
import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.request.resource.PackageResourceReference;
import org.apache.wicket.util.io.IOUtils;
import org.apache.wicket.util.template.PackageTextTemplate;
import org.apache.wicket.util.template.TextTemplate;
import org.apache.wicket.request.flow.RedirectToUrlException;
import javax.servlet.http.HttpServletResponse;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Iterator;

public class Polar extends WebPage {
    private static final String jsResourceFiles[] = {
            "jquery.min.js",
            "bootstrap.min.js",
            "jquery.easing.min.js",
            "scrolling-nav.js",
            "d3.min.js",
            "topojson.v1.min.js"
    };

    private JSONObject jsonSetUpObject;

    public Polar() {
        throw new RedirectToUrlException(
                "http://polar.usc.edu",
                HttpServletResponse.SC_MOVED_PERMANENTLY);
    }

    public void renderHead(IHeaderResponse response) {
        for (String jsFile : jsResourceFiles) {
            System.out.println(urlFor(new PackageResourceReference(getClass(), "js/" + jsFile), null));
            PackageResourceReference jsRef = new PackageResourceReference(getClass(), "js/" + jsFile);
            JavaScriptHeaderItem js = JavaScriptHeaderItem.forReference(jsRef);
            response.render(js);
        }

        if (jsonSetUpObject != null) {
            Iterator<?> keys = jsonSetUpObject.keys();
            // Iterate Team Member Keys
            while (keys.hasNext()) {
                String key = (String) keys.next();
                // Load the javascript file template
                TextTemplate template = new PackageTextTemplate(Polar.class, String.format("js/d3/Team%1$s.js", key), "text/javascript", "UTF-8");
                HashMap<String, Object> vars = new HashMap<String, Object>();
                // get file values
                JSONObject filesObject = jsonSetUpObject.getJSONObject(key);
                Iterator<?> fileKeys = filesObject.keys();
                while (fileKeys.hasNext()) {
                    String fKey = (String) fileKeys.next();
                    String filename = filesObject.getString(fKey);
                    vars.put(fKey, urlFor(new PackageResourceReference(getClass(), String.format("data/%1$s", filename)), null));
                }
                String jsString = template.asString(vars);
                response.render(OnDomReadyHeaderItem.forScript(jsString));
            }
        }
    }

    public static JSONObject getJsonObject(String filename) throws Exception {
        InputStream is = Polar.class.getResourceAsStream(filename);
        String jsonString = IOUtils.toString(is);
        return new JSONObject(jsonString);
    }
}