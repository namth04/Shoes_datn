package com.fpoly.processor;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.fpoly.config.Environment;
import com.fpoly.config.PartnerInfo;
import com.fpoly.constants.MoMoException;
import com.fpoly.constants.Execute;



public abstract class AbstractProcess<T, V> {

    protected PartnerInfo partnerInfo;
    protected Environment environment;
    protected Execute execute = new Execute();

    public AbstractProcess(Environment environment) {
        this.environment = environment;
        this.partnerInfo = environment.getPartnerInfo();
    }

    public static Gson getGson() {
        return new GsonBuilder()
                .disableHtmlEscaping()
                .create();
    }

    public abstract V execute(T request) throws MoMoException;
}
