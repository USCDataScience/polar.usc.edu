package edu.usc.polar;
import org.apache.wicket.markup.head.IHeaderResponse;
import org.apache.wicket.markup.head.JavaScriptHeaderItem;
import org.apache.wicket.markup.head.OnDomReadyHeaderItem;
import org.apache.wicket.markup.html.WebPage;
import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.request.resource.PackageResourceReference;
import org.apache.wicket.resource.TextTemplateResourceReference;
import org.apache.wicket.util.lang.Objects;
import org.apache.wicket.util.template.PackageTextTemplate;
import org.apache.wicket.util.template.TextTemplate;

import java.util.HashMap;

public class Polar extends WebPage {
    private static final String jsResourceFiles[] = {
            "jquery.min.js",
            "bootstrap.min.js",
            "jquery.easing.min.js",
            "scrolling-nav.js",
            "d3.min.js"
    };
    private static final String jsResourceTemplates[] = {
        "d3examples.js"
    };
    public Polar() {
        add(new Label("message", "Polar Deep Search Engine!"));
    }

    public void renderHead(IHeaderResponse response) {
        for (String jsFile : jsResourceFiles) {
            System.out.println(urlFor(new PackageResourceReference(getClass(), "js/" + jsFile), null));
            PackageResourceReference jsRef = new PackageResourceReference(getClass(), "js/" + jsFile);
            JavaScriptHeaderItem js = JavaScriptHeaderItem.forReference(jsRef);
            response.render(js);
        }

        for (String jsTemplate : jsResourceTemplates) {
            TextTemplate template = new PackageTextTemplate(Polar.class, "js/" + jsTemplate, "text/javascript", "UTF-8");
            HashMap<String, Object> vars = new HashMap<String, Object>();
            vars.put("dataResourcePath", urlFor(new PackageResourceReference(getClass(), "data/data.tsv"), null));
            String jsString = template.asString(vars);
            response.render(OnDomReadyHeaderItem.forScript(jsString));
        }
    }

}